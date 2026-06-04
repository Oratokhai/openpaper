"use client";

import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { mockTags } from "@/lib/mock-data";
import {
  Eye, Pencil, Settings, Send, ChevronDown, X,
  Mail, Zap, Clock, AlertTriangle, CheckCircle, Copy, ExternalLink, ImagePlus,
  MoreHorizontal, LayoutGrid,
} from "lucide-react";
import { uploadImage } from "@/lib/upload-client";
import { AutoTextarea } from "@/components/editor/auto-textarea";
import { RichEditor } from "@/components/editor/rich-editor";
import { useIsland } from "@/components/layout/island-context";
import { publishArticle, getArticleForEdit, type PublicationType } from "./actions";
import { FileText, GraduationCap, BarChart3 } from "lucide-react";

const TYPE_OPTIONS: { value: PublicationType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "article",   label: "Article",   description: "Explainers, deep-dives, takes",   icon: <FileText className="w-4 h-4" /> },
  { value: "tutorial",  label: "Tutorial",  description: "Step-by-step how-to guide",       icon: <GraduationCap className="w-4 h-4" /> },
  { value: "benchmark", label: "Benchmark", description: "Evals, tests, comparisons",        icon: <BarChart3 className="w-4 h-4" /> },
];

const COVER_OPTIONS = [
  { id: "a", gradient: "from-[#4a1410] via-[#9e3329] to-[#d8503f]" },
  { id: "b", gradient: "from-[#2a0c0a] to-[#d8503f]" },
  { id: "c", gradient: "from-[#ff6b5c] to-[#7a2620]" },
  { id: "d", gradient: "from-[#bc6c25] to-[#7a2620]" },
  { id: "e", gradient: "from-[#d8503f] to-[#0a0a0a]" },
  { id: "f", gradient: "from-[#9e3329] via-[#ff6b5c] to-[#7a2620]" },
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
  const [moreOpen, setMoreOpen] = useState(false);

  // Editor instance (for extracting content on publish) + save state
  const editorRef = useRef<Editor | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [words, setWords] = useState(0);
  const [dirty, setDirty] = useState(false);
  const { setIsland, pushActivity } = useIsland();
  const [publishing, setPublishing] = useState(false);
  const [pubError, setPubError] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [result, setResult] = useState<{ username: string; slug: string; firstPublish?: boolean } | null>(null);

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

  // Live word count + dirty tracking (debounced) — feeds the contextual island.
  useEffect(() => {
    const ed = editorRef.current;
    if (!editorReady || !ed) return;
    let t: ReturnType<typeof setTimeout>;
    const recount = () => {
      const text = ed.getText().trim();
      setWords(text ? text.split(/\s+/).length : 0);
    };
    const onUpdate = () => {
      setDirty(true);
      clearTimeout(t);
      t = setTimeout(recount, 300);
    };
    recount();
    ed.on("update", onUpdate);
    return () => { ed.off("update", onUpdate); clearTimeout(t); };
  }, [editorReady]);

  // Drive the island's "writing" face; clear it in preview and on leave.
  useEffect(() => {
    if (preview) { setIsland(null); return; }
    setIsland({ mode: "writing", words, saved: !dirty && (!!articleId || draftSaved), isNew: !articleId });
  }, [words, dirty, articleId, draftSaved, preview, setIsland]);

  useEffect(() => () => setIsland(null), [setIsland]);

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
    setDirty(false);
    pushActivity({
      icon: "check",
      tone: "ok",
      label: res.status === "published" ? "Published ✓" : "Draft saved",
    });

    if (res.status === "published") {
      setResult({ username: res.username, slug: res.slug, firstPublish: res.firstPublish });
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

          {/* Mobile action cluster — desktop uses the floating command bar below */}
          <div className="flex md:hidden items-center gap-2">
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff6b5c] text-white text-sm font-medium hover:bg-[#e8513f] transition-colors"
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

      {/* ── Floating command bar (desktop) ──────────────────── */}
      {!published && !preview && (
        <div className="hidden md:flex fixed bottom-7 left-[calc(50%+38px)] -translate-x-1/2 z-40 items-center gap-1 rounded-full bg-[#161616] border border-white/[0.08] p-1.5 shadow-2xl shadow-black/50">
          <button
            onClick={() => setPreview(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-[#cfccc4] hover:bg-white/[0.06] transition-colors"
          >
            <Eye className="w-[18px] h-[18px]" />
            Preview
          </button>
          <button
            onClick={() => setPanelOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-[#cfccc4] hover:bg-white/[0.06] transition-colors"
          >
            <Settings className="w-[18px] h-[18px]" />
            Settings
          </button>

          <span className="mx-1.5 h-6 w-px bg-white/[0.12]" />

          <button
            onClick={() => setPanelOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ff6b5c] text-white text-sm font-semibold hover:bg-[#e8513f] transition-colors"
          >
            <Send className="w-[15px] h-[15px]" />
            Publish
          </button>

          <div className="relative">
            <button
              onClick={() => setMoreOpen((o) => !o)}
              aria-label="More"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              className="flex items-center justify-center w-10 h-10 rounded-full text-[#cfccc4] hover:bg-white/[0.06] transition-colors"
            >
              <MoreHorizontal className="w-[18px] h-[18px]" />
            </button>
            {moreOpen && (
              <div
                role="menu"
                className="absolute bottom-full right-0 mb-2 w-44 rounded-xl border border-white/[0.1] bg-[#161616] p-1.5 shadow-2xl"
              >
                <a
                  href="/studio"
                  role="menuitem"
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[#cfccc4] hover:text-[#f5f3ee] hover:bg-white/[0.05] transition-colors"
                >
                  <LayoutGrid className="w-4 h-4 text-[#888]" /> Open Studio
                </a>
                <a
                  href="/drafts"
                  role="menuitem"
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[#cfccc4] hover:text-[#f5f3ee] hover:bg-white/[0.05] transition-colors"
                >
                  <Eye className="w-4 h-4 text-[#888]" /> All drafts
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Close the more-menu when clicking elsewhere */}
      {moreOpen && <div className="fixed inset-0 z-30" onClick={() => setMoreOpen(false)} />}

      {/* In preview mode, a single floating control to exit back to editing */}
      {!published && preview && (
        <button
          onClick={() => setPreview(false)}
          className="hidden md:flex fixed bottom-7 left-[calc(50%+38px)] -translate-x-1/2 z-40 items-center gap-2 px-6 py-3 rounded-full bg-[#161616] border border-white/[0.08] text-sm text-[#f5f3ee] shadow-2xl shadow-black/50 hover:bg-[#1c1c1c] transition-colors"
        >
          <Pencil className="w-[16px] h-[16px]" />
          Back to editing
        </button>
      )}

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
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] bg-[#111] border-l border-white/[0.08] flex flex-col transition-transform duration-300 ease-out ${
          panelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {published ? (
          <PublishedState
            title={title || "Untitled"}
            username={result?.username ?? "me"}
            slug={articleSlug}
            firstPublish={result?.firstPublish ?? false}
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
                          ? "border-[#ff6b5c]/60 bg-[#ff6b5c]/10 text-[#f5f3ee]"
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
                          selectedCover === c.id ? "ring-[#ff6b5c]" : "ring-transparent"
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
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-[#f5f3ee] placeholder:text-[#6e6e6e] focus:outline-none focus:border-[#ff6b5c]/50 resize-none transition-all"
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
                      emailDelivery ? "bg-[#ff6b5c]" : "bg-white/[0.08]"
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
                className="w-full py-3 rounded-xl bg-[#ff6b5c] text-white text-[14px] font-medium hover:bg-[#e8513f] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

function Confetti() {
  // Self-contained burst — no external dep. Brand coral/cream palette.
  const colors = ["#ff6b5c", "#ff9a8f", "#fdf0d5", "#e8513f", "#ffffff"];
  const pieces = Array.from({ length: 42 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <style>{`
        @keyframes op-confetti-fall {
          0%   { transform: translateY(-10%) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map((i) => {
        const left = (i * 97) % 100;
        const delay = (i % 10) * 0.12;
        const dur = 2.4 + ((i * 13) % 18) / 10;
        const size = 6 + (i % 4) * 2;
        const color = colors[i % colors.length];
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              top: "-12px",
              left: `${left}%`,
              width: size,
              height: size * 1.6,
              background: color,
              borderRadius: 1,
              animation: `op-confetti-fall ${dur}s linear ${delay}s forwards`,
            }}
          />
        );
      })}
    </div>
  );
}

function PublishedState({
  title, username, slug, firstPublish, copied, onCopy, onClose,
}: {
  title: string; username: string; slug: string; firstPublish: boolean;
  copied: boolean; onCopy: () => void; onClose: () => void;
}) {
  const url =
    typeof window !== "undefined" ? `${window.location.origin}/${username}/${slug}` : `/${username}/${slug}`;
  const shareText = firstPublish
    ? `I just published my first piece on Openpaper: "${title}"`
    : `"${title}" — new on Openpaper`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
      {firstPublish && <Confetti />}

      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          firstPublish
            ? "bg-[#ff6b5c]/15 border border-[#ff6b5c]/30"
            : "bg-emerald-500/10 border border-emerald-500/20"
        }`}
      >
        {firstPublish ? (
          <span className="text-3xl leading-none">🎉</span>
        ) : (
          <CheckCircle className="w-7 h-7 text-emerald-400" />
        )}
      </div>

      <div>
        {firstPublish && (
          <p className="text-[11px] uppercase tracking-widest text-[#ff9a8f] mb-2">
            Your first article
          </p>
        )}
        <h2
          className="text-[#f5f3ee] text-2xl mb-2"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {firstPublish ? "It’s live 🎉" : "Published"}
        </h2>
        <p className="text-[#858585] text-[14px] leading-relaxed line-clamp-2">
          {firstPublish
            ? "That blank page is behind you. Now help your first readers find it — share it where your people are."
            : title}
        </p>
      </div>

      <div className="w-full space-y-3">
        <a
          href={`/${username}/${slug}`}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#ff6b5c] text-white text-[14px] font-medium hover:bg-[#e8513f] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View article
        </a>

        {/* Share-to-publicize nudge */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={xUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.08] text-[14px] text-[#aaa] hover:text-[#f5f3ee] hover:border-white/[0.16] transition-all"
          >
            <XIcon className="w-3.5 h-3.5" />
            Share
          </a>
          <a
            href={liUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.08] text-[14px] text-[#aaa] hover:text-[#f5f3ee] hover:border-white/[0.16] transition-all"
          >
            <LinkedInIcon className="w-3.5 h-3.5" />
            Share
          </a>
        </div>

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
