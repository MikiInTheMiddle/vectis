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
const MIGRATION_KEY = "vectis-wireframe-db-migrated-v1";
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
  const [shared, setShared] = useState(false);
  const [ready, setReady] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [accessPassword, setAccessPassword] = useState("");
  const [accessError, setAccessError] = useState("");

  const path = typeof window === "undefined" ? "" : window.location.pathname;
  const pageComments = useMemo(() => comments.filter((item) => item.path === path), [comments, path]);

  const persist = (next: Comment[]) => {
    setComments(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  useEffect(() => {
    let active = true;
    fetch("/api/review-access", { cache: "no-store" }).then(async (response) => {
      const data = await response.json() as { unlocked?: boolean };
      if (!active) return;
      setEnabled(Boolean(data.unlocked)); setReady(true);
      if (data.unlocked) {
        try { setComments(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch { setComments([]); }
        setAuthor(localStorage.getItem(NAME_KEY) || "");
      }
    }).catch(() => { if (active) setReady(true); });
    return () => { active = false; document.body.classList.remove("reviewMode", "reviewPlacing"); };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("reviewMode", enabled);
    return () => document.body.classList.remove("reviewMode");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const sync = async () => {
      const response = await fetch(`/api/review-comments?path=${encodeURIComponent(window.location.pathname)}`, { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json() as { comments: Comment[] };
      setShared(true);
      let local: Comment[] = [];
      try { local = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { local = []; }
      let mergedPage = data.comments;
      if (!localStorage.getItem(MIGRATION_KEY)) {
        const remoteIds = new Set(data.comments.map((item) => item.id));
        const pending = local.filter((item) => item.path === window.location.pathname && !remoteIds.has(item.id));
        await Promise.all(pending.map((item) => fetch("/api/review-comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) })));
        mergedPage = [...data.comments, ...pending];
        localStorage.setItem(MIGRATION_KEY, "1");
      }
      const merged = [...local.filter((item) => item.path !== window.location.pathname), ...mergedPage];
      setComments(merged); localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    };
    void sync();
    const refresh = () => { if (document.visibilityState === "visible") void sync(); };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    const interval = window.setInterval(sync, 15000);
    return () => { window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); window.clearInterval(interval); };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.toggle("reviewPlacing", placing);
    return () => document.body.classList.remove("reviewPlacing");
  }, [enabled, placing]);

  useEffect(() => {
    if (!enabled) return;
    const collect = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>(".header, main > section, .expertiseRow, .consultingPractice, .caseCard, .caseIndexRow"));
      const used = new Map<string, number>();
      const headerBottom = document.querySelector<HTMLElement>(".header")?.getBoundingClientRect().bottom || 0;
      const contentRailTop = headerBottom + 46;
      const railBottom = window.innerHeight - 44;
      const next = nodes.map((node, index) => {
        const isNavigation = node.classList.contains("header");
        const title = isNavigation ? "Menu di navigazione" : node.querySelector("h1,h2,h3")?.textContent?.trim() || node.getAttribute("aria-label") || `Blocco ${index + 1}`;
        let id = node.dataset.reviewAnchor || slug(title);
        const count = used.get(id) || 0;
        used.set(id, count + 1);
        if (count) id = `${id}-${count + 1}`;
        node.dataset.reviewAnchor = id;
        node.dataset.reviewLabel = title;
        const rect = node.getBoundingClientRect();
        const desiredTop = rect.top + 18;
        const pinTop = isNavigation
          ? headerBottom + 8
          : Math.min(Math.max(desiredTop, contentRailTop), Math.max(contentRailTop, Math.min(rect.bottom - 35, railBottom)));
        return {
          id,
          label: title,
          top: pinTop,
          right: 18,
          visible: isNavigation || (rect.bottom > contentRailTop && rect.top < railBottom),
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
    document.addEventListener("selectionchange", selectedText);
    return () => {
      window.removeEventListener("scroll", collect); window.removeEventListener("resize", collect);
      document.removeEventListener("click", click, true); document.removeEventListener("mouseup", selectedText); document.removeEventListener("touchend", selectedText); document.removeEventListener("selectionchange", selectedText);
    };
  }, [enabled, placing]);

  const unlock = async (event: FormEvent) => {
    event.preventDefault(); setAccessError("");
    const response = await fetch("/api/review-access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: accessPassword }) });
    if (!response.ok) { const data = await response.json(); setAccessError(data.error || "Accesso non riuscito"); return; }
    setAccessPassword(""); setAccessOpen(false); setEnabled(true);
    try { setComments(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch { setComments([]); }
    setAuthor(localStorage.getItem(NAME_KEY) || "");
  };

  const lockReview = async () => {
    await fetch("/api/review-access", { method: "DELETE" });
    setPanelOpen(false); setPlacing(false); setEnabled(false); setShared(false);
  };

  if (path.startsWith("/review-admin")) return null;
  if (!ready) return null;
  if (!enabled) return <div className="reviewLayer">
    <button className="reviewUnlock" onClick={() => setAccessOpen(true)}>Commenta</button>
    {accessOpen && <div className="reviewAccessBackdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAccessOpen(false); }}><form className="reviewAccessModal" onSubmit={unlock}><button type="button" className="reviewAccessClose" onClick={() => setAccessOpen(false)}>×</button><small>VECTIS REVIEW</small><h2>Accedi ai commenti</h2><p>Inserisci la password condivisa per commentare il wireframe.</p><input type="password" value={accessPassword} onChange={(event) => setAccessPassword(event.target.value)} placeholder="Password review" required /><button type="submit">Entra in modalità review</button>{accessError && <strong>{accessError}</strong>}</form></div>}
  </div>;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!activeAnchor || !body.trim() || body.trim().length > 4000 || !author.trim()) return;
    localStorage.setItem(NAME_KEY, author.trim());
    const comment = { id: uid(), path, anchor: activeAnchor.id, label: activeAnchor.label, quote: activeAnchor.quote, author: author.trim(), body: body.trim(), createdAt: new Date().toISOString(), resolved: false, replies: [] };
    persist([...comments, comment]);
    if (shared) void fetch("/api/review-comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(comment) });
    setBody(""); setActiveAnchor(null);
  };

  const addReply = (id: string) => {
    const draft = replyDrafts[id]?.trim();
    if (!draft || !author.trim()) return;
    const next = comments.map((item) => item.id === id ? { ...item, replies: [...item.replies, { id: uid(), author: author.trim(), body: draft, createdAt: new Date().toISOString() }] } : item);
    persist(next);
    const changed = next.find((item) => item.id === id);
    if (shared && changed) void fetch("/api/review-comments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(changed) });
    setReplyDrafts({ ...replyDrafts, [id]: "" });
  };

  const pinCandidates = anchors
    .map((anchor) => ({ anchor, count: pageComments.filter((item) => item.anchor === anchor.id && !item.resolved).length }))
    .filter(({ anchor, count }) => count > 0 && anchor.visible)
    .sort((a, b) => a.anchor.top - b.anchor.top);
  const visiblePins = pinCandidates.reduce<{ cursor: number; pins: Array<{ anchor: Anchor; count: number }> }>((result, { anchor, count }) => {
    const top = Math.max(anchor.top, result.cursor + 35);
    return { cursor: top, pins: top < window.innerHeight - 35 ? [...result.pins, { anchor: { ...anchor, top }, count }] : result.pins };
  }, { cursor: -Infinity, pins: [] }).pins;

  return <div className="reviewLayer">
    {visiblePins.map(({ anchor, count }) => {
      return <button key={anchor.id} className="reviewPin" style={{ top: anchor.top, right: anchor.right }} onClick={() => { setPanelOpen(true); setActiveAnchor({ id: anchor.id, label: anchor.label }); }} aria-label={`${count} commenti su ${anchor.label}`}>{count}</button>;
    })}
    {selection && <button className="reviewSelection" style={{ left: selection.x, top: selection.y }} onPointerDown={(e) => e.preventDefault()} onClick={() => { setActiveAnchor({ id: selection.anchor, label: selection.label, quote: selection.quote }); setPanelOpen(true); setSelection(null); }}>Commenta selezione</button>}
    <button className="reviewLauncher" onClick={() => { setPanelOpen(true); setPlacing(false); }}><span>{pageComments.filter((item) => !item.resolved).length}</span> Commenti</button>
    <div className="reviewActionGroup">
      <p className="reviewHint">Seleziona una frase per commentarla, oppure</p>
      <button className={`reviewAdd ${placing ? "isActive" : ""}`} onClick={() => { setPlacing(!placing); setPanelOpen(false); setSelection(null); }}>{placing ? "Annulla" : "+ Commenta un blocco"}</button>
    </div>

    {panelOpen && <aside className="reviewPanel" aria-label="Pannello commenti">
      <header><div><small>REVIEW MODE</small><h2>Commenti</h2><p>{shared ? "Condivisi con il team" : "Salvati in questo browser · prototipo"}</p><button className="reviewLogout" onClick={lockReview}>Esci dalla review</button></div><button onClick={() => { setPanelOpen(false); setActiveAnchor(null); }}>×</button></header>
      {activeAnchor && <form className="reviewComposer" onSubmit={submit}>
        <strong>{activeAnchor.label}</strong>
        {activeAnchor.quote && <blockquote>“{activeAnchor.quote}”</blockquote>}
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Il tuo nome" aria-label="Il tuo nome" required />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Scrivi un commento…" aria-label="Commento" required />
        <div className={`reviewCharacterCount ${body.length > 4000 ? "isOver" : body.length > 1000 ? "isLong" : ""}`} aria-live="polite"><span>{body.length} / 4.000</span>{body.length > 4000 ? <em>Riduci il testo di {body.length - 4000} caratteri.</em> : body.length > 3500 ? <em>Restano {4000 - body.length} caratteri.</em> : body.length > 1000 ? <em>Commento molto lungo: valuta se dividerlo in indicazioni più puntuali.</em> : null}</div>
        <div><button type="button" onClick={() => setActiveAnchor(null)}>Annulla</button><button type="submit" disabled={body.trim().length > 4000}>Pubblica</button></div>
      </form>}
      <div className="reviewList">
        {!pageComments.length && !activeAnchor && <p className="reviewEmpty">Nessun commento in questa pagina. Seleziona del testo oppure usa “Commenta un blocco”.</p>}
        {[...pageComments].reverse().map((item) => <article key={item.id} className={item.resolved ? "isResolved" : ""}>
          <div className="reviewMeta"><strong>{item.label}</strong>{item.resolved && <span>Risolto</span>}</div>
          {item.quote && <blockquote>“{item.quote}”</blockquote>}
          <p>{item.body}</p><small>{item.author} · {new Date(item.createdAt).toLocaleDateString("it-IT")}</small>
          {item.replies.map((reply) => <div className="reviewReply" key={reply.id}><p>{reply.body}</p><small>{reply.author}</small></div>)}
          <div className="reviewReplyBox"><input value={replyDrafts[item.id] || ""} onChange={(e) => setReplyDrafts({ ...replyDrafts, [item.id]: e.target.value })} placeholder="Rispondi…" /><button onClick={() => addReply(item.id)}>↗</button></div>
        </article>)}
      </div>
    </aside>}
  </div>;
}
