import Link from "next/link";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    author: {
      name: string;
      username: string;
      avatar: string | null;
    };
    publishedAt: string;
    readingTime: string;
    tags: string[];
    likes: number;
    comments: number;
    featured?: boolean;
  };
  variant?: "default" | "compact" | "featured";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const initials = article.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  if (variant === "featured") {
    return (
      <article className="group p-6 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all">
        <div className="flex items-center gap-2 mb-4">
          <AuthorAvatar initials={initials} />
          <div className="flex items-center gap-2 text-sm text-[#8d8d8d]">
            <Link
              href={`/${article.author.username}`}
              className="text-[#aaa] hover:text-[#f5f3ee] transition-colors font-medium"
            >
              {article.author.name}
            </Link>
            <span>·</span>
            <span>{formatRelativeDate(article.publishedAt)}</span>
            <span>·</span>
            <span>{article.readingTime}</span>
          </div>
        </div>

        <Link href={`/${article.author.username}/${article.id}`}>
          <h2 className="text-xl font-semibold text-[#f5f3ee] leading-snug mb-3 group-hover:text-white transition-colors" style={{ fontFamily: "var(--font-fraunces)" }}>
            {article.title}
          </h2>
          <p className="text-[#969696] text-sm leading-relaxed line-clamp-3 mb-4">
            {article.excerpt}
          </p>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 2).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          <ArticleActions likes={article.likes} comments={article.comments} />
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex gap-4 py-4 border-b border-white/[0.05] last:border-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 text-xs text-[#858585]">
            <Link href={`/${article.author.username}`} className="hover:text-[#aaa] transition-colors">
              {article.author.name}
            </Link>
            <span>·</span>
            <span>{formatRelativeDate(article.publishedAt)}</span>
          </div>
          <Link href={`/${article.author.username}/${article.id}`}>
            <h3 className="text-base font-medium text-[#ddd] leading-snug group-hover:text-[#f5f3ee] transition-colors line-clamp-2" style={{ fontFamily: "var(--font-fraunces)" }}>
              {article.title}
            </h3>
          </Link>
          <div className="flex items-center gap-3 mt-2 text-xs text-[#858585]">
            <span>{article.readingTime}</span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" /> {article.likes}
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group py-6 border-b border-white/[0.06] last:border-0">
      <div className="flex items-center gap-2 mb-3">
        <AuthorAvatar initials={initials} size="sm" />
        <div className="flex items-center gap-2 text-sm text-[#8d8d8d]">
          <Link
            href={`/${article.author.username}`}
            className="text-[#999] hover:text-[#f5f3ee] transition-colors"
          >
            {article.author.name}
          </Link>
          <span>·</span>
          <span>{formatRelativeDate(article.publishedAt)}</span>
          <span>·</span>
          <span>{article.readingTime}</span>
        </div>
      </div>

      <Link href={`/${article.author.username}/${article.id}`}>
        <h2 className="text-lg font-semibold text-[#f5f3ee] leading-snug mb-2 group-hover:text-white transition-colors" style={{ fontFamily: "var(--font-fraunces)" }}>
          {article.title}
        </h2>
        <p className="text-[#969696] text-sm leading-relaxed line-clamp-2 mb-4">
          {article.excerpt}
        </p>
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {article.tags.slice(0, 2).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <ArticleActions likes={article.likes} comments={article.comments} />
      </div>
    </article>
  );
}

function AuthorAvatar({
  initials,
  size = "md",
}: {
  initials: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-[#ff6b5c] to-[#c9443a] flex items-center justify-center text-white font-semibold shrink-0",
        size === "sm" ? "w-6 h-6 text-[10px]" : "w-7 h-7 text-xs"
      )}
    >
      {initials}
    </div>
  );
}

function TagBadge({ tag }: { tag: string }) {
  return (
    <Link
      href={`/explore?tag=${encodeURIComponent(tag)}`}
      className="text-xs text-[#8d8d8d] bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 rounded-full hover:text-[#aaa] hover:border-white/[0.12] transition-all"
    >
      {tag}
    </Link>
  );
}

function ArticleActions({
  likes,
  comments,
}: {
  likes: number;
  comments: number;
}) {
  return (
    <div className="flex items-center gap-4 text-[#858585]">
      <button className="flex items-center gap-1.5 text-xs hover:text-[#f5f3ee] transition-colors group/btn">
        <Heart className="w-3.5 h-3.5 group-hover/btn:text-rose-400 transition-colors" />
        <span>{likes}</span>
      </button>
      <button className="flex items-center gap-1.5 text-xs hover:text-[#f5f3ee] transition-colors">
        <MessageCircle className="w-3.5 h-3.5" />
        <span>{comments}</span>
      </button>
      <button className="hover:text-[#f5f3ee] transition-colors">
        <Bookmark className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
