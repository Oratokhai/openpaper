import { getArticleForReader, listArticlesByAuthor } from "@/db/articles";
import { getEngagement, listComments, isFollowing, isSubscribed } from "@/db/interactions";
import { DbArticleReader } from "@/components/article/db-article-reader";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;

  const dbArticle = await getArticleForReader(username, slug);
  if (!dbArticle) notFound();

  const { userId } = await auth();
  const authorId = dbArticle.author.id;
  const [moreArticles, engagement, comments, following, subscribed] = await Promise.all([
    listArticlesByAuthor(username).then((arts) =>
      arts.filter((a) => a.articleId !== dbArticle.article.id).slice(0, 3),
    ),
    getEngagement(dbArticle.article.id, userId),
    listComments(dbArticle.article.id),
    isFollowing(userId, authorId),
    isSubscribed(userId, authorId),
  ]);

  return (
    <DbArticleReader
      article={dbArticle.article}
      author={dbArticle.author}
      moreArticles={moreArticles}
      isOwner={userId === authorId}
      engagement={engagement}
      comments={comments}
      canComment={Boolean(userId)}
      isFollowing={following}
      isSubscribed={subscribed}
    />
  );
}
