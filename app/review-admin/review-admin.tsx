"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Reply = { id: string; author: string; body: string; createdAt: string };
type Comment = { id: string; path: string; anchor: string; label: string; quote?: string; author: string; body: string; createdAt: string; resolved: boolean; replies: Reply[] };

export default function ReviewAdmin() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("open");
  const [path, setPath] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);

  const load = async () => {
    const response = await fetch("/api/review-comments?all=1", { cache: "no-store" });
    if (response.ok) { const data = await response.json(); setComments(data.comments); setAuthenticated(true); setMessage(""); }
    else if (response.status === 503) setMessage("Database non ancora collegato al progetto Vercel.");
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    const refresh = () => { if (document.visibilityState === "visible") void load(); };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    const interval = window.setInterval(load, 15000);
    return () => { window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); window.clearInterval(interval); };
  }, []);

  const login = async (event: FormEvent) => {
    event.preventDefault(); setMessage("");
    const response = await fetch("/api/review-admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!response.ok) { const data = await response.json(); setMessage(data.error || "Accesso non riuscito"); return; }
    setPassword(""); await load();
  };
  const logout = async () => { await fetch("/api/review-admin/login", { method: "DELETE" }); setAuthenticated(false); setComments([]); };
  const toggle = async (comment: Comment) => {
    const next = { ...comment, resolved: !comment.resolved };
    setComments(comments.map((item) => item.id === comment.id ? next : item));
    await fetch("/api/review-comments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
  };
  const remove = async (id: string) => {
    if (!window.confirm("Eliminare definitivamente questo commento?")) return;
    const response = await fetch(`/api/review-comments?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (response.ok) setComments(comments.filter((item) => item.id !== id));
  };

  const paths = useMemo(() => [...new Set(comments.map((item) => item.path))].sort(), [comments]);
  const visible = comments.filter((item) => (path === "all" || item.path === path) && (filter === "all" || (filter === "open" ? !item.resolved : item.resolved)));
  const visibleIds = visible.map((item) => item.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
  const toggleSelected = (id: string) => setSelected(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  const toggleAllVisible = () => setSelected(allVisibleSelected ? selected.filter((id) => !visibleIds.includes(id)) : [...new Set([...selected, ...visibleIds])]);
  const resolveSelected = async () => {
    const targets = comments.filter((item) => selected.includes(item.id) && !item.resolved);
    const next = comments.map((item) => selected.includes(item.id) ? { ...item, resolved: true } : item);
    setComments(next); setSelected([]);
    await Promise.all(targets.map((item) => fetch("/api/review-comments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...item, resolved: true }) })));
  };
  const deleteSelected = async () => {
    const ids = selected.filter((id) => comments.some((item) => item.id === id));
    if (!ids.length || !window.confirm(`Eliminare definitivamente ${ids.length} comment${ids.length === 1 ? "o" : "i"}?`)) return;
    const responses = await Promise.all(ids.map((id) => fetch(`/api/review-comments?id=${encodeURIComponent(id)}`, { method: "DELETE" })));
    const deleted = ids.filter((_, index) => responses[index].ok);
    setComments(comments.filter((item) => !deleted.includes(item.id))); setSelected([]);
  };

  if (!authenticated) return <main className="adminLogin"><form onSubmit={login}><small>VECTIS CONTENT WIREFRAME</small><h1>Review admin</h1><p>Accedi per consultare e gestire tutti i commenti condivisi.</p><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password admin" required /><button>Accedi</button>{message && <strong>{message}</strong>}</form></main>;

  return <main className="adminPage">
    <header><div><small>VECTIS CONTENT WIREFRAME</small><h1>Commenti</h1><p>{comments.filter((item) => !item.resolved).length} aperti · {comments.length} totali</p></div><div><Link href="/">Apri il wireframe ↗</Link><button onClick={logout}>Esci</button></div></header>
    <section className="adminFilters"><select value={path} onChange={(event) => setPath(event.target.value)}><option value="all">Tutte le pagine</option>{paths.map((item) => <option key={item} value={item}>{item}</option>)}</select><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="open">Aperti</option><option value="resolved">Risolti</option><option value="all">Tutti</option></select></section>
    <section className="adminBatch"><label><input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} /> Seleziona tutti i commenti visibili</label><span>{selected.length} selezionati</span><div><button disabled={!selected.length} onClick={resolveSelected}>Risolvi selezionati</button><button disabled={!selected.length} onClick={deleteSelected}>Elimina selezionati</button></div></section>
    <section className="adminComments">
      {!visible.length && <p>Nessun commento corrisponde ai filtri.</p>}
      {visible.map((item) => <article key={item.id} className={`${item.resolved ? "isResolved" : ""} ${selected.includes(item.id) ? "isSelected" : ""}`}><div className="adminCommentHead"><label className="adminSelect"><input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelected(item.id)} aria-label={`Seleziona commento di ${item.author}`} /></label><div><span>{item.path}</span><h2>{item.label}</h2></div><div><button onClick={() => toggle(item)}>{item.resolved ? "Riapri" : "Risolvi"}</button><button onClick={() => remove(item.id)}>Elimina</button></div></div>{item.quote && <blockquote>“{item.quote}”</blockquote>}<p>{item.body}</p><small>{item.author} · {new Date(item.createdAt).toLocaleString("it-IT")}</small>{item.replies.map((reply) => <div className="adminReply" key={reply.id}><p>{reply.body}</p><small>{reply.author}</small></div>)}</article>)}
    </section>
  </main>;
}
