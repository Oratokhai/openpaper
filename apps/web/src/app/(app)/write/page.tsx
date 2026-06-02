"use client";

import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { mockTags } from "@/lib/mock-data";
import {
  Eye, Pencil, Settings, Send, ChevronDown, X,
  Mail, Zap, Clock, AlertTriangle, CheckCircle, Copy, ExternalLink, ImagePlus,
} from "lucide-react";
import { uploadImage } from "@/lib/upload-client";
import { AutoTextarea } from "@/components/editor/auto-textarea";
import { RichEditor } from "@/components/editor/rich-editor";
import { publishArticle, getArticleForEdit, type PublicationType } from "./actions";
import { FileText, GraduationCap, BarChart3 } from "lucide-react";

const TYPE_OPTIONS: { value: PublicationType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "article",   label: "Article",   description: "Explainers, deep-dives, takes",   icon: <FileText className="w-4 h-4" /> },
  { value: "tutorial",  label: "Tutorial",  description: "Step-by-step how-to guide",       icon: <GraduationCap className="w-4 h-4" /> },
  { value: "benchmark", label: "Benchmark", description: "Evals, tests, comparisons",        icon: <BarChart3 className="w-4 h-4" /> },
];

const COVER_OPTIONS = [
  { id: "a", gradient: "from-[#283618] via-[#3a4d22] to-[#606c38]" },
  { id: "b", gradient: "from-[#1a2410] to-[#283618]" },
  { id: "c", gradient: "from-[#606c38] to-[#283618]" },
  { id: "d", gradient: "from-[#bc6c25] to-[#283618]" },
  { id: "e", gradient: "from-[#283618] to-[#0a0a0a]" },
  { id: "f", gradient: "from-[#3a4d22] via-[#606c38] to-[#283618]" },
];

type Freshness = "current" | "aging" | "outdated" | "none";

const FRESHNESS_OPTIONS: { value: Freshness; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  { value: "none",     label: "None",     description: "No freshness indicator",           icon: null,                                        color: "border-white/[0.08] text-[#858585]" },
  { value: "current",  label: "Current",  description: "Verified accurate as of this month", icon: <Zap className="w-3.5 h-3.5" />,            color: "border-emerald-500/40 text-emerald-400" },
  { value: "aging",    label: "Aging",    description: "Content may need updates soon",     icon: <Clock className="w-3.5 h-3.5" />,           color: "border-amber-500/40 text-amber-400" },
  { value: "outdated", label: "Outdated", description: "Review before relying on this",     icon: <AlertTriangle className="w-3.5 h-3.5" />,   color: "border-rose-500/40 text-rose-400" },
];

type JSONNode = { type?: string; attrs?: Record<string, unknown>; content?: JSONNode[] };

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [preview, setPreview] = useState(false);

  // Publish panel state
  const [panelOpen, setPanelOpen] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [selectedCover, setSelectedCover] = useState("a");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverError, setCoverError] = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [freshness, setFreshness] = useState<Freshness>("none");
  const [pubType, setPubType] = useState<PublicationType>("article");
  const [emailDelivery, setEmailDelivery] = useState(true);
  const [published, setPublished] = useState(false);
  const [copied, setCopied] = useState(false);

  // Editor instance (for extracting content on publish) + save state
  const editorRef = useRef<Editor | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [pubError, setPubError] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [result, setResult] = useState<{ username: string; slug: string } | null>(null);

  // Editing an existing article: ?edit=<id>
  const [articleId, setArticleId] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const pendingContent = useRef<unknown>(null);

  // Load the article to edit (once, from the URL).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("edit");
    if (!id) return;
    setLoadingExisting(true);
    getArticleForEdit(id)
      .then((a) => {
        if (!a) return;
        setArticleId(a.id);
        setTitle(a.title);
        setSubtitle(a.subtitle);
        setSelectedTags(a.tags);
        setFreshness(a.freshness);
        setPubType(a.type);
        setEmailDelivery(a.emailDelivery);
        setSelectedCover(COVER_OPTIONS.find((c) => c.gradient === a.coverGradient)?.id ?? "a");
        setCoverImage(a.coverImage);
        pendingContent.current = a.contentJson;
        if (editorRef.current && a.contentJson) editorRef.current.commands.setContent(a.contentJson as object);
      })
      .finally(() => setLoadingExisting(false));
  }, []);

  // If content arrived before the editor was ready, apply it once ready.
  useEffect(() => {
    if (editorReady && pendingContent.current && editorRef.current) {
      editorRef.current.commands.setContent(pendingContent.current as object);
      pendingContent.current = null;
    }
  }, [editorReady]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 3)
    );
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setCoverError("");
    setUploadingCover(true);
    try {
      const url = await uploadImage(file);
      setCoverImage(url);
    } catch (err) {
      console.error("[cover upload] failed:", err);
      setCoverError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingCover(false);
    }
  };

  const save = async (status: "draft" | "published") => {
    setPubError("");
    if (!title.trim()) {
      setPubError("Add a title first.");
      return;
    }

    const editor = editorRef.current;
    const contentJson = editor?.getJSON() ?? null;
    const contentText = editor?.getText() ?? "";

    // Tiptap's getJSON() drops attrs on React-NodeView atom nodes (e.g. model
    // mentions). Read the slugs in document order from the live doc and patch
    // them back into the JSON in the same order so they persist.
    const mentionSlugs: string[] = [];
    editor?.state.doc.descendants((n) => {
      if (n.type.name === "modelMention") mentionSlugs.push((n.attrs.slug as string) || "");
    });
    if (contentJson) {
      let i = 0;
      const patch = (node: JSONNode) => {
        if (node.type === "modelMention") {
          node.attrs = { ...(node.attrs ?? {}), slug: mentionSlugs[i++] ?? "" };
        }
        node.content?.forEach(patch);
      };
      patch(contentJson as JSONNode);
    }
    const models = new Set(mentionSlugs.filter(Boolean));

    const coverGradient =
      COVER_OPTIONS.find((c) => c.id === selectedCover)?.gradient ?? COVER_OPTIONS[0].gradient;

    setPublishing(true);
    const res = await publishArticle({
      articleId: articleId ?? undefined,
      title,
      subtitle,
      contentJson,
      contentText,
      tags: selectedTags,
      models: [...models],
      coverGradient,
      coverImage,
      freshness,
      type: pubType,
      emailDelivery,
      status,
    });
    setPublishing(false);

    if (!res.ok) {
      setPubError(res.error);
      return;
    }

    // Remember the new id so subsequent saves update instead of duplicating.
    setArticleId(res.id);

    if (res.status === "published") {
      setResult({ username: res.username, slug: res.slug });
      setPublished(true);
    } else {
      setResult({ username: res.username, slug: res.slug });
      setDraftSaved(true);
      setPanelOpen(false);
    }
  };

  const handleCopy = () => {
    const url = result
      ? `${window.location.origin}/${result.username}/${result.slug}`
      : window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const articleSlug = result?.slug ?? "untitled";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toolbar */}
      <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-[#858585]">
            <span className="text-[#f5f3ee] font-medium">
              {preview ? "Preview" : articleId ? "Edit article" : "New article"}
            </span>
            <span>·</span>
            <span>{loadingExisting ? "Loading…" : draftSaved ? "Draft saved" : articleId ? "Saved" : "Not saved"}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/drafts"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#888] hover:text-[#f5f3ee] hover:bg-white/[0.04] transition-all"
            >
              Drafts
            </a>
            <button
              onClick={() => setPreview((p) => !p)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#888] hover:text-[#f5f3ee] hover:bg-white/[0.04] transition-all"
            >
              {preview ? <Pencil className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {preview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={() => setPanelOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#888] hover:text-[#f5f3ee] hover:bg-white/[0.04] transition-all"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={() => setPanelOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#606c38] text-white text-sm font-medium hover:bg-[#283618] transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="max-w-[680px] mx-auto">
          {/* Tags */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 text-[13px] text-[#888] bg-white/[0.05] border border-white/[0.08] px-3 py-1 rounded-full"
              >
                {tag}
                {!preview && (
                  <button onClick={() => toggleTag(tag)} className="hover:text-[#f5f3ee] transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {!preview && (
              <div className="relative">
                <button
                  onClick={() => setShowTagPicker(!showTagPicker)}
                  className="flex items-center gap-1.5 text-[13px] text-[#858585] hover:text-[#888] transition-colors px-3 py-1 border border-dashed border-white/[0.08] rounded-full hover:border-white/[0.16]"
                >
                  Add topic
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showTagPicker && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[#161616] border border-white/[0.1] rounded-xl p-2 z-50 shadow-2xl">
                    <div className="grid grid-cols-1 gap-0.5 max-h-48 overflow-y-auto">
                      {mockTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? "text-[#f5f3ee] bg-white/[0.08]"
                              : "text-[#969696] hover:text-[#f5f3ee] hover:bg-white/[0.04]"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          {preview ? (
            <h1
              className="text-[#f5f3ee] text-4xl md:text-5xl leading-tight tracking-[-0.02em] mb-8"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {title || "Untitled"}
            </h1>
          ) : (
            <AutoTextarea
              value={title}
              onChange={setTitle}
              placeholder="Article title"
              className="text-[#f5f3ee] text-4xl md:text-5xl leading-tight tracking-[-0.02em] mb-8"
              style={{ fontFamily: "var(--font-fraunces)" }}
            />
          )}

          <div className="prose">
            <RichEditor
              editable={!preview}
              onReady={(e) => { editorRef.current = e; setEditorReady(true); }}
            />
          </div>
        </div>
      </div>

      {/* ── Publish panel ───────────────────────────────────── */}
      {/* Backdrop */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => !published && setPanelOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[420px] bg-[#111] border-l border-white/[0.08] flex flex-col transition-transform duration-300 ease-out ${
          panelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {published ? (
          <PublishedState
            title={title || "Untitled"}
            username={result?.username ?? "me"}
            slug={articleSlug}
            copied={copied}
            onCopy={handleCopy}
            onClose={() => { setPanelOpen(false); setPublished(false); }}
          />
        ) : (
          <>
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-white/[0.06] shrink-0">
              <h2 className="text-[#f5f3ee] text-[15px] font-medium" style={{ fontFamily: "var(--font-fraunces)" }}>
                Publish article
              </h2>
              <button
                onClick={() => setPanelOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#858585] hover:text-[#f5f3ee] hover:bg-white/[0.06] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

              {/* Publication type */}
              <section>
                <p className="text-[11px] uppercase tracking-widest text-[#858585] mb-3">Type</p>
                <div className="grid grid-cols-3 gap-2">
                  {TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPubType(opt.value)}
                      title={opt.description}
                      className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-center transition-all ${
                        pubType === opt.value
                          ? "border-[#606c38]/60 bg-[#606c38]/10 text-[#f5f3ee]"
                          : "border-white/[0.06] text-[#8d8d8d] hover:border-white/[0.12] hover:text-[#aaa]"
                      }`}
                    >
                      {opt.icon}
                      <span className="text-[12px] font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Cover */}
              <section>
                <p className="text-[11px] uppercase tracking-widest text-[#858585] mb-3">Cover</p>

                {coverImage ? (
                  <div className="relative mb-3 rounded-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverImage} alt="Cover preview" className="w-full h-28 object-cover" />
                    <button
                      onClick={() => setCoverImage(null)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    {COVER_OPTIONS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCover(c.id)}
                        className={`h-12 rounded-xl bg-gradient-to-br ${c.gradient} transition-all ring-2 ring-offset-2 ring-offset-[#111] ${
                          selectedCover === c.id ? "ring-[#606c38]" : "ring-transparent"
                        }`}
                      />
                    ))}
                  </div>
                )}

                <button
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="flex items-center gap-2 text-[13px] text-[#aaa] border border-white/[0.1] rounded-lg px-3 py-2 hover:text-[#f5f3ee] hover:border-white/[0.2] transition-all disabled:opacity-50"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  {uploadingCover ? "Uploading…" : coverImage ? "Replace image" : "Upload an image"}
                </button>
                {coverError && <p className="text-[12px] text-rose-400 mt-2">{coverError}</p>}
                <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </section>

              {/* Subtitle */}
              <section>
                <p className="text-[11px] uppercase tracking-widest text-[#858585] mb-3">Subtitle <span className="normal-case text-[#6e6e6e] tracking-normal">(optional)</span></p>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="A one-line hook for your article…"
                  rows={2}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-[#f5f3ee] placeholder:text-[#6e6e6e] focus:outline-none focus:border-[#606c38]/50 resize-none transition-all"
                />
              </section>

              {/* Topics (read-only summary) */}
              {selectedTags.length > 0 && (
                <section>
                  <p className="text-[11px] uppercase tracking-widest text-[#858585] mb-3">Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((t) => (
                      <span key={t} className="text-[12px] text-[#888] bg-white/[0.04] border border-white/[0.07] px-2.5 py-1 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Freshness */}
              <section>
                <p className="text-[11px] uppercase tracking-widest text-[#858585] mb-3">Freshness stamp</p>
                <div className="space-y-2">
                  {FRESHNESS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFreshness(opt.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                        freshness === opt.value
                          ? `${opt.color} bg-white/[0.04]`
                          : "border-white/[0.06] text-[#858585] hover:border-white/[0.12] hover:text-[#888]"
                      }`}
                    >
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      {!opt.icon && <span className="w-3.5 h-3.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium leading-none mb-0.5">{opt.label}</p>
                        <p className="text-[11px] opacity-60 leading-none">{opt.description}</p>
                      </div>
                      {freshness === opt.value && (
                        <div className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Email delivery */}
              <section>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-[#858585] mb-1">Email delivery</p>
                    <p className="text-[13px] text-[#858585] leading-relaxed">
                      Send this article to your email subscribers when it publishes.
                    </p>
                  </div>
                  <button
                    onClick={() => setEmailDelivery((e) => !e)}
                    className={`shrink-0 mt-0.5 w-11 h-6 rounded-full transition-colors relative ${
                      emailDelivery ? "bg-[#606c38]" : "bg-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        emailDelivery ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                {emailDelivery && (
                  <div className="mt-3 flex items-center gap-2 text-[12px] text-[#858585]">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>Will be sent to your subscribers on publish</span>
                  </div>
                )}
              </section>
            </div>

            {/* Panel footer */}
            <div className="px-6 py-5 border-t border-white/[0.06] shrink-0 space-y-3">
              {pubError && (
                <p className="text-[13px] text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-4 py-2.5">{pubError}</p>
              )}
              <button
                onClick={() => save("published")}
                disabled={publishing}
                className="w-full py-3 rounded-xl bg-[#606c38] text-white text-[14px] font-medium hover:bg-[#283618] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                {publishing ? "Publishing…" : "Publish now"}
              </button>
              <button
                onClick={() => save("draft")}
                disabled={publishing}
                className="w-full py-2.5 rounded-xl text-[14px] text-[#858585] hover:text-[#888] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save as draft
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PublishedState({
  title, username, slug, copied, onCopy, onClose,
}: {
  title: string; username: string; slug: string; copied: boolean; onCopy: () => void; onClose: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <CheckCircle className="w-7 h-7 text-emerald-400" />
      </div>
      <div>
        <h2
          className="text-[#f5f3ee] text-2xl mb-2"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Published
        </h2>
        <p className="text-[#858585] text-[14px] leading-relaxed line-clamp-2">
          {title}
        </p>
      </div>

      <div className="w-full space-y-3">
        <a
          href={`/${username}/${slug}`}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#606c38] text-white text-[14px] font-medium hover:bg-[#283618] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View article
        </a>
        <button
          onClick={onCopy}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.08] text-[14px] text-[#888] hover:text-[#f5f3ee] hover:border-white/[0.16] transition-all"
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button
          onClick={onClose}
          className="w-full py-2.5 text-[14px] text-[#787878] hover:text-[#8d8d8d] transition-colors"
        >
          Back to editor
        </button>
      </div>
    </div>
  );
}
