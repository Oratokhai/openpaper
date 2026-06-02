import { Users, Heart, FileText } from "lucide-react";
import { FeedCard } from "@/components/article/feed-card";
import { FollowButton } from "./follow-button";
import { SubscribeButton } from "./subscribe-button";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileBanner } from "./profile-banner";
import { formatDate } from "@/lib/utils";
import type { FeedArticle } from "@/db/articles";
import type { users } from "@/db/schema";

type UserRow = typeof users.$inferSelect;

export function DbProfile({
  user,
  articles,
  followers = 0,
  isSelf = false,
  isFollowing = false,
  isSubscribed = false,
}: {
  user: UserRow;
  articles: FeedArticle[];
  followers?: number;
  isSelf?: boolean;
  isFollowing?: boolean;
  isSubscribed?: boolean;
}) {
  const totalLikes = articles.reduce((sum, a) => sum + a.likes, 0);

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Banner */}
      <div className="mb-6">
        <ProfileBanner bannerUrl={user.bannerUrl} isSelf={isSelf} />

        <div className="relative z-10 px-2 -mt-12 flex items-end justify-between gap-4">
          <ProfileAvatar avatarUrl={user.avatarUrl} name={user.name} isSelf={isSelf} />
          {isSelf ? (
            <a
              href="/drafts"
              className="pb-1 px-5 py-2.5 rounded-xl border border-white/[0.1] text-sm text-[#aaa] hover:text-[#f5f3ee] hover:border-white/[0.25] transition-all"
            >
              Your drafts
            </a>
          ) : (
            <div className="flex items-center gap-2 pb-1">
              <SubscribeButton writerId={user.id} initialSubscribed={isSubscribed} />
              <FollowButton targetUserId={user.id} initialFollowing={isFollowing} />
            </div>
          )}
        </div>

        <div className="px-2 mt-4">
          <h1 className="text-[#f5f3ee] text-3xl" style={{ fontFamily: "var(--font-fraunces)" }}>
            {user.name}
          </h1>
          <div className="flex items-center gap-x-3 mt-1.5 flex-wrap text-sm text-[#8d8d8d]">
            <span>@{user.username}</span>
            <span className="text-[#858585]">Joined {formatDate(user.createdAt.toISOString())}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-5 px-2 mb-4 text-sm flex-wrap">
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#787878]" />
          <span className="text-[#f5f3ee] font-medium">{followers.toLocaleString()}</span>
          <span className="text-[#858585]">followers</span>
        </span>
        <span className="text-[#2a2a2a]">·</span>
        <span className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#787878]" />
          <span className="text-[#f5f3ee] font-medium">{articles.length}</span>
          <span className="text-[#858585]">{articles.length === 1 ? "article" : "articles"}</span>
        </span>
        <span className="text-[#2a2a2a]">·</span>
        <span className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-[#787878]" />
          <span className="text-[#f5f3ee] font-medium">{totalLikes.toLocaleString()}</span>
          <span className="text-[#858585]">likes</span>
        </span>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="px-2 mb-8 text-[15px] text-[#aaa] leading-relaxed">{user.bio}</p>
      )}

      {/* Articles */}
      <div className="mt-8 border-t border-white/[0.06] px-2">
        {articles.length === 0 ? (
          <p className="py-16 text-center text-[#858585] text-[15px]">
            No published articles yet.
          </p>
        ) : (
          articles.map((a) => <FeedCard key={a.id} article={a} cover={a.cover} />)
        )}
      </div>
    </div>
  );
}
