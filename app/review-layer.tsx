"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Reply = { id: string; author: string; body: string; createdAt: string };
type Comment = {
  id: string; path: string; anchor: string; label: string; quote?: string;
  author: string; body: string; createdAt: string; resolved: boolean; replies: Reply[];
};
type Anchor = { id: string; label: string; top: number; right: number; visible: boolean };

const STORAGE_KEY = "vectis-wireframe-comments-v1";
const NAME_KEY = "vectis-wireframe-reviewer-v1";
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const slug = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 54) || "blocco";

export default function ReviewLayer() {
  const [enabled, setEnabled] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState<{ id: string; label: string; quote?: string } | null>(null);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [selection, setSelection] = useState<{ anchor: string; label: string; quote: string; x: number; y: number } | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const path = typeof window === "undefined" ? "" : window.location.pathname;
  const pageComments = useMemo(() => comments.filter((item) => item.path === path), [comments, path]);

  const persist = (next: Comment[]) => {
    setComments(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("review") !== "1") return;
    // This client-only gate deliberately activates after hydration so normal pages render no review UI.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    document.body.classList.add("reviewMode");
    try { setComments(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch { setComments([]); }
    setAuthor(localStorage.getItem(NAME_KEY) || "");
    return () => document.body.classList.remove("reviewMode", "reviewPlacing");
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.toggle("reviewPlacing", placing);
    return () => document.body.classList.remove("reviewPlacing");
  }, [enabled, placing]);

  useEffect(() => {
    if (!enabled) return;
    const originals = new Map<HTMLAnchorElement, string>();
    document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((link) => {
      originals.set(link, link.getAttribute("href") || "");
      const url = new URL(link.href, window.location.origin);
      url.searchParams.set("review", "1");
      link.href = `${url.pathname}${url.search}${url.hash}`;
    });

    const collect = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("main > section, .expertiseRow, .consultingPractice, .caseCard, .caseIndexRow"));
      const used = new Map<string, number>();
      const headerBottom = document.querySelector<HTMLElement>(".header")?.getBoundingClientRect().bottom || 0;
      const next = nodes.map((node, index) => {
        const title = node.querySelector("h1,h2,h3")?.textContent?.trim() || node.getAttribute("aria-label") || `Blocco ${index + 1}`;
        let id = node.dataset.reviewAnchor || slug(title);
        const count = used.get(id) || 0;
        used.set(id, count + 1);
        if (count) id = `${id}-${count + 1}`;
        node.dataset.reviewAnchor = id;
        node.dataset.reviewLabel = title;
        const rect = node.getBoundingClientRect();
        const pinTop = rect.top + 18;
        return {
          id,
          label: title,
          top: pinTop,
          right: Math.max(8, window.innerWidth - rect.right + 12),
          visible: pinTop > headerBottom + 8 && pinTop < window.innerHeight - 36,
        };
      });
      setAnchors(next);
    };
    collect();
    window.addEventListener("scroll", collect, { passive: true });
    window.addEventListener("resize", collect);

    const click = (event: MouseEvent) => {
      if (!placing) return;
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-review-anchor]");
      if (!target || target.closest(".reviewLayer")) return;
      event.preventDefault(); event.stopPropagation();
      setActiveAnchor({ id: target.dataset.reviewAnchor!, label: target.dataset.reviewLabel || "Blocco" });
      setPanelOpen(true); setPlacing(false); setSelection(null);
    };
    document.addEventListener("click", click, true);

    const selectedText = () => {
      const current = window.getSelection();
      const quote = current?.toString().trim();
      if (!current || !quote || current.rangeCount === 0) { setSelection(null); return; }
      const base = current.anchorNode instanceof Element ? current.anchorNode : current.anchorNode?.parentElement;
      const target = base?.closest<HTMLElement>("[data-review-anchor]");
      if (!target || target.closest(".reviewLayer")) { setSelection(null); return; }
      const rect = current.getRangeAt(0).getBoundingClientRect();
      setSelection({ anchor: target.dataset.reviewAnchor!, label: target.dataset.reviewLabel || "Blocco", quote: quote.slice(0, 420), x: Math.min(rect.right, window.innerWidth - 190), y: Math.max(10, rect.bottom + 8) });
    };
    document.addEventListener("mouseup", selectedText);
    document.addEventListener("touchend", selectedText);
    return () => {
      originals.forEach((href, link) => link.setAttribute("href", href));
      window.removeEventListener("scroll", collect); window.removeEventListener("resize", collect);
      document.removeEventListener("click", click, true); document.removeEventListener("mouseup", selectedText); document.removeEventListener("touchend", selectedText);
    };
  }, [enabled, placing]);

  if (!enabled) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!activeAnchor || !body.trim() || !author.trim()) return;
    localStorage.setItem(NAME_KEY, author.trim());
    persist([...comments, { id: uid(), path, anchor: activeAnchor.id, label: activeAnchor.label, quote: activeAnchor.quote, author: author.trim(), body: body.trim(), createdAt: new Date().toISOString(), resolved: false, replies: [] }]);
    setBody(""); setActiveAnchor(null);
  };

  const toggleResolved = (id: string) => persist(comments.map((item) => item.id === id ? { ...item, resolved: !item.resolved } : item));
  const addReply = (id: string) => {
    const draft = replyDrafts[id]?.trim();
    if (!draft || !author.trim()) return;
    persist(comments.map((item) => item.id === id ? { ...item, replies: [...item.replies, { id: uid(), author: author.trim(), body: draft, createdAt: new Date().toISOString() }] } : item));
    setReplyDrafts({ ...replyDrafts, [id]: "" });
  };

  return <div className="reviewLayer">
    {anchors.map((anchor) => {
      const count = pageComments.filter((item) => item.anchor === anchor.id && !item.resolved).length;
      if (!count || !anchor.visible) return null;
      return <button key={anchor.id} className="reviewPin" style={{ top: anchor.top, right: anchor.right }} onClick={() => { setPanelOpen(true); setActiveAnchor({ id: anchor.id, label: anchor.label }); }} aria-label={`${count} commenti su ${anchor.label}`}>{count}</button>;
    })}
    {selection && <button className="reviewSelection" style={{ left: selection.x, top: selection.y }} onMouseDown={(e) => e.preventDefault()} onClick={() => { setActiveAnchor({ id: selection.anchor, label: selection.label, quote: selection.quote }); setPanelOpen(true); setSelection(null); }}>Commenta selezione</button>}
    <button className="reviewLauncher" onClick={() => { setPanelOpen(true); setPlacing(false); }}><span>{pageComments.filter((item) => !item.resolved).length}</span> Commenti</button>
    <button className={`reviewAdd ${placing ? "isActive" : ""}`} onClick={() => { setPlacing(!placing); setPanelOpen(false); setSelection(null); }}>{placing ? "Annulla" : "+ Commenta un blocco"}</button>

    {panelOpen && <aside className="reviewPanel" aria-label="Pannello commenti">
      <header><div><small>REVIEW MODE</small><h2>Commenti</h2><p>Salvati in questo browser · prototipo</p></div><button onClick={() => { setPanelOpen(false); setActiveAnchor(null); }}>×</button></header>
      {activeAnchor && <form className="reviewComposer" onSubmit={submit}>
        <strong>{activeAnchor.label}</strong>
        {activeAnchor.quote && <blockquote>“{activeAnchor.quote}”</blockquote>}
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Il tuo nome" aria-label="Il tuo nome" required />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Scrivi un commento…" aria-label="Commento" required />
        <div><button type="button" onClick={() => setActiveAnchor(null)}>Annulla</button><button type="submit">Pubblica</button></div>
      </form>}
      <div className="reviewList">
        {!pageComments.length && !activeAnchor && <p className="reviewEmpty">Nessun commento in questa pagina. Seleziona del testo oppure usa “Commenta un blocco”.</p>}
        {[...pageComments].reverse().map((item) => <article key={item.id} className={item.resolved ? "isResolved" : ""}>
          <div className="reviewMeta"><strong>{item.label}</strong><button onClick={() => toggleResolved(item.id)}>{item.resolved ? "Riapri" : "Risolvi"}</button></div>
          {item.quote && <blockquote>“{item.quote}”</blockquote>}
          <p>{item.body}</p><small>{item.author} · {new Date(item.createdAt).toLocaleDateString("it-IT")}</small>
          {item.replies.map((reply) => <div className="reviewReply" key={reply.id}><p>{reply.body}</p><small>{reply.author}</small></div>)}
          <div className="reviewReplyBox"><input value={replyDrafts[item.id] || ""} onChange={(e) => setReplyDrafts({ ...replyDrafts, [item.id]: e.target.value })} placeholder="Rispondi…" /><button onClick={() => addReply(item.id)}>↗</button></div>
        </article>)}
      </div>
    </aside>}
  </div>;
}
