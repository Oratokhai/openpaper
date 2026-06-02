import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import type { UserJSON } from "@clerk/backend";
import { db } from "./index";
import { users } from "./schema";

/* ──────────────────────────────────────────────────────────────────────────
   Syncing Clerk users → our `users` table.

   Two entry points share one upsert:
   - upsertUserFromClerk()  ← called by the Clerk webhook (production path)
   - syncCurrentUser()      ← lazy sync run from the app layout (works locally,
                              where webhooks can't reach localhost)
   ────────────────────────────────────────────────────────────────────────── */

type UpsertInput = {
  id: string;
  baseHandle: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
};

function slugifyHandle(raw: string, id: string): string {
  const slug = (raw || "").toLowerCase().replace(/[^a-z0-9_]/g, "");
  return slug || `user${id.slice(-6).toLowerCase()}`;
}

function isUniqueViolation(err: unknown): boolean {
  const e = err as { code?: string; message?: string } | undefined;
  return e?.code === "23505" || /duplicate key|unique constraint/i.test(e?.message ?? "");
}

async function upsertUser(input: UpsertInput): Promise<void> {
  let handle = input.baseHandle;

  for (let attempt = 0; ; attempt++) {
    try {
      await db
        .insert(users)
        .values({
          id: input.id,
          username: handle,
          name: input.name || handle,
          email: input.email,
          avatarUrl: input.avatarUrl,
        })
        .onConflictDoUpdate({
          target: users.id,
          // On update we intentionally don't touch `username` — keep the handle
          // the user already has.
          set: {
            name: input.name || handle,
            email: input.email,
            avatarUrl: input.avatarUrl,
            updatedAt: new Date(),
          },
        });
      return;
    } catch (err) {
      // A *different* user already holds this generated handle → try a variant.
      if (isUniqueViolation(err) && attempt < 5) {
        handle = `${input.baseHandle}${Math.floor(1000 + Math.random() * 9000)}`;
        continue;
      }
      throw err;
    }
  }
}

/* ── Webhook payload (snake_case UserJSON) ──────────────────────────────────── */

export async function upsertUserFromClerk(data: UserJSON): Promise<void> {
  const email =
    data.email_addresses?.find((e) => e.id === data.primary_email_address_id)?.email_address ??
    data.email_addresses?.[0]?.email_address ??
    null;

  const name = [data.first_name, data.last_name].filter(Boolean).join(" ").trim();
  const metaUsername = (data.unsafe_metadata as { username?: string } | undefined)?.username;
  const rawHandle =
    data.username || metaUsername || (email ? email.split("@")[0] : "") || name.replace(/\s+/g, "");

  await upsertUser({
    id: data.id,
    baseHandle: slugifyHandle(rawHandle, data.id),
    name,
    email,
    avatarUrl: data.image_url ?? null,
  });
}

export async function deleteUserById(id: string): Promise<void> {
  const { eq } = await import("drizzle-orm");
  await db.delete(users).where(eq(users.id, id));
}

export async function getUsernameById(userId: string): Promise<string | null> {
  const { eq } = await import("drizzle-orm");
  const [u] = await db.select({ username: users.username }).from(users).where(eq(users.id, userId)).limit(1);
  return u?.username ?? null;
}

/* ── Lazy sync from the current session (camelCase User resource) ───────────── */

type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

function mapCurrentUser(user: ClerkUser): UpsertInput {
  const email =
    user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? null;
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  const metaUsername = (user.unsafeMetadata as { username?: string } | undefined)?.username;
  const rawHandle =
    user.username || metaUsername || (email ? email.split("@")[0] : "") || name.replace(/\s+/g, "");

  return {
    id: user.id,
    baseHandle: slugifyHandle(rawHandle, user.id),
    name,
    email,
    avatarUrl: user.imageUrl ?? null,
  };
}

/**
 * Ensures the currently signed-in Clerk user has a row in our DB. Safe to call
 * on every request — it's an idempotent upsert and never throws into the render.
 */
export async function syncCurrentUser(): Promise<string | null> {
  try {
    const user = await currentUser();
    if (!user) return null;
    await upsertUser(mapCurrentUser(user));
    return user.id;
  } catch (err) {
    // Never let a sync hiccup break the app render.
    console.error("[syncCurrentUser] failed:", err);
    return null;
  }
}
