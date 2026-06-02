import { notFound } from "next/navigation";
import { getUserByUsername, listArticlesByAuthor } from "@/db/articles";
import { isFollowing, countFollowers, isSubscribed } from "@/db/interactions";
import { DbProfile } from "@/components/profile/db-profile";
import { auth } from "@clerk/nextjs/server";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const dbUser = await getUserByUsername(username);
  if (!dbUser) notFound();

  const { userId } = await auth();
  const [arts, followers, following, subscribed] = await Promise.all([
    listArticlesByAuthor(username),
    countFollowers(dbUser.id),
    isFollowing(userId, dbUser.id),
    isSubscribed(userId, dbUser.id),
  ]);

  return (
    <DbProfile
      user={dbUser}
      articles={arts}
      followers={followers}
      isSelf={userId === dbUser.id}
      isFollowing={following}
      isSubscribed={subscribed}
    />
  );
}
