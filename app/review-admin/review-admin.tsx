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

  const load = async () => {
    const response = await fetch("/api/review-comments?all=1", { cache: "no-store" });
    if (response.ok) { const data = await response.json(); setComments(data.comments); setAuthenticated(true); setMessage(""); }
    else if (response.status === 503) setMessage("Database non ancora collegato al progetto Vercel.");
  };
  // Initial session check is intentionally performed after client hydration.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);

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

  if (!authenticated) return <main className="adminLogin"><form onSubmit={login}><small>VECTIS CONTENT WIREFRAME</small><h1>Review admin</h1><p>Accedi per consultare e gestire tutti i commenti condivisi.</p><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password admin" required /><button>Accedi</button>{message && <strong>{message}</strong>}</form></main>;

  return <main className="adminPage">
    <header><div><small>VECTIS CONTENT WIREFRAME</small><h1>Commenti</h1><p>{comments.filter((item) => !item.resolved).length} aperti · {comments.length} totali</p></div><div><Link href="/?review=1">Apri il wireframe ↗</Link><button onClick={logout}>Esci</button></div></header>
    <section className="adminFilters"><select value={path} onChange={(event) => setPath(event.target.value)}><option value="all">Tutte le pagine</option>{paths.map((item) => <option key={item} value={item}>{item}</option>)}</select><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="open">Aperti</option><option value="resolved">Risolti</option><option value="all">Tutti</option></select></section>
    <section className="adminComments">
      {!visible.length && <p>Nessun commento corrisponde ai filtri.</p>}
      {visible.map((item) => <article key={item.id} className={item.resolved ? "isResolved" : ""}><div className="adminCommentHead"><div><span>{item.path}</span><h2>{item.label}</h2></div><div><button onClick={() => toggle(item)}>{item.resolved ? "Riapri" : "Risolvi"}</button><button onClick={() => remove(item.id)}>Elimina</button></div></div>{item.quote && <blockquote>“{item.quote}”</blockquote>}<p>{item.body}</p><small>{item.author} · {new Date(item.createdAt).toLocaleString("it-IT")}</small>{item.replies.map((reply) => <div className="adminReply" key={reply.id}><p>{reply.body}</p><small>{reply.author}</small></div>)}</article>)}
    </section>
  </main>;
}
