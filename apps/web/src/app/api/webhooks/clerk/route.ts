import type { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { upsertUserFromClerk, deleteUserById } from "@/db/users";

// Clerk sends user lifecycle events here. Configure the endpoint + signing
// secret in the Clerk dashboard → Webhooks. Verification reads
// CLERK_WEBHOOK_SIGNING_SECRET from the environment.
export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("[clerk webhook] verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  try {
    switch (evt.type) {
      case "user.created":
      case "user.updated":
        await upsertUserFromClerk(evt.data);
        break;
      case "user.deleted":
        if (evt.data.id) await deleteUserById(evt.data.id);
        break;
      default:
        // Ignore other event types for now.
        break;
    }
  } catch (err) {
    console.error(`[clerk webhook] handler failed for ${evt.type}:`, err);
    return new Response("Handler error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
