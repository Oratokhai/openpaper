import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";
import { FeedCardActions } from "./feed-card-actions";

interface FeedCardProps {
  article: {
    id: string;
    articleId?: string;
    title: string;
    excerpt: string;
    author: { name: string; username: string; avatar?: string | null };
    publishedAt: string;
    readingTime: string;
    tags: string[];
    likes: number;
    comments: number;
    liked?: boolean;
    saved?: boolean;
    coverImage?: string | null;
  };
  cover: string;
}

export function FeedCard({ article, cover }: FeedCardProps) {
  const initials = article.author.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <article className="border-b border-white/[0.06] py-10 first:pt-0">
      {/* Cover */}
      <Link href={`/${article.author.username}/${article.id}`}>
        {article.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.coverImage} alt={article.title} className="h-72 w-full rounded-2xl object-cover mb-6" />
        ) : (
          <div className={`h-72 rounded-2xl bg-gradient-to-br ${cover} mb-6 flex items-center justify-center overflow-hidden`}>
            <span
              className="text-white/95 text-4xl px-10 text-center leading-tight"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {article.title}
            </span>
          </div>
        )}
      </Link>

      {/* Publication / topic badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[13px] text-[#888] bg-white/[0.05] border border-white/[0.07] px-3 py-1 rounded-full">
          {article.tags[0]}
        </span>
      </div>

      {/* Title */}
      <Link href={`/${article.author.username}/${article.id}`}>
        <h2
          className="text-[#f5f3ee] text-3xl leading-snug mb-3 hover:text-white transition-colors"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {article.title}
        </h2>
        <p className="text-[#888] text-base leading-relaxed line-clamp-2 mb-5">
          {article.excerpt}
        </p>
      </Link>

      {/* Footer: author + engagement */}
      <div className="flex items-center justify-between">
        <Link href={`/${article.author.username}`} className="flex items-center gap-3 group">
          {article.author.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b5c] to-[#c9443a] flex items-center justify-center text-white text-xs font-semibold">
              {initials}
            </span>
          )}
          <span className="text-[15px] text-[#aaa] group-hover:text-[#f5f3ee] transition-colors">
            {article.author.name}
          </span>
          <span className="text-[15px] text-[#858585]">· {formatRelativeDate(article.publishedAt)}</span>
        </Link>

        <FeedCardActions
          articleId={article.articleId}
          href={`/${article.author.username}/${article.id}`}
          likes={article.likes}
          comments={article.comments}
          initialLiked={article.liked}
          initialSaved={article.saved}
        />
      </div>
    </article>
  );
}
