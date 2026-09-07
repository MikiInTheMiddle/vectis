export function Brand({ light = false }: { light?: boolean }) {
  return <a className={`brand ${light ? "brandLight" : ""}`} href="/" aria-label="Vectis, home"><span className="brandAsset" aria-hidden="true" /></a>;
}

export function Header({ dark = true }: { dark?: boolean }) {
  return <header className={`header ${dark ? "headerDark" : "headerLight"}`}><div className="prototypeBar"><span>Vectis / UX prototype</span><span>Navigation + content validation</span></div><div className="wrap headerInner">
    <Brand light={dark} />
    <nav aria-label="Navigazione principale"><a href="/chi-siamo">Chi siamo</a><a href="/metodo">Metodo</a><a href="/competenze">Competenze</a><a href="/case-studies">Case Studies</a><a href="/team">Team</a><a href="mailto:musella@vectislegal.eu">Contatti</a></nav>
    <details className="mobileNav"><summary aria-label="Apri menu">Menu</summary><div><a href="/chi-siamo">Chi siamo</a><a href="/metodo">Metodo</a><a href="/competenze">Competenze</a><a href="/case-studies">Case Studies</a><a href="/team">Team</a><a href="mailto:musella@vectislegal.eu">Contatti</a></div></details>
  </div></header>;
}

export function Footer() {
  return <footer><div className="wrap footerTop"><Brand light /><p>Intelligence<br />with judgment.</p><a href="mailto:musella@vectislegal.eu">musella@vectislegal.eu ↗</a></div><div className="wrap footerBottom"><span>© {new Date().getFullYear()} Vectis Legal</span><span>Milano, Italia</span><span>Privacy · Cookie</span></div></footer>;
}

export function MethodStrip() {
  const steps = [["01","Expert judgment"],["02","AI workflow"],["03","Knowledge"],["04","Quality review"],["05","Feedback loop"]];
  return <section className="methodStrip section"><div className="wrap"><div className="sectionHead"><div><p className="eyebrow">Il nostro metodo</p><h2>Ogni mandato,<br />un sistema dedicato.</h2></div><p>Il team definisce l’obiettivo. La tecnologia amplia la conoscenza. Gli avvocati verificano, decidono e ne assumono la responsabilità.</p></div><div className="steps">{steps.map(([n,t]) => <div key={n}><span>{n}</span><p>{t}</p></div>)}</div><a className="textLink" href="/metodo">Approfondisci il metodo <span>→</span></a></div></section>;
}

export function InternalHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <section className="internalHero"><Header /><div className="wrap internalHeroInner"><p className="eyebrow light">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div></section>;
}

export function PageEnd() { return <><section className="contactBand section wrap"><p className="eyebrow">Iniziamo</p><h2>Portateci una decisione.<br />Costruiremo il metodo.</h2><a className="button" href="mailto:musella@vectislegal.eu">Parliamone <span>↗</span></a></section><Footer /></>; }
