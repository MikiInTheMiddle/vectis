import { Footer, Header } from "./site-components";

const practices = [
  ["01", "Operazioni straordinarie", "Fusioni, acquisizioni, riorganizzazioni societarie e due diligence."],
  ["02", "Corporate & compliance", "Governance, segreteria societaria, controlli interni e compliance integrata."],
  ["03", "Contratti commerciali", "Drafting, revisione e negoziazione per relazioni più solide."],
  ["04", "Normativa AI", "Conformità, responsabilità e governance dell’intelligenza artificiale."],
];

const outcomes = [
  ["Qualità", "Più capacità cognitiva, informazioni rilevanti e profondità di analisi."],
  ["Tempestività", "Tempi di risposta rapidi e certi, senza compromettere l’accuratezza."],
  ["Controllo", "Valutazioni strutturate che aumentano copertura e affidabilità decisionale."],
  ["Prevedibilità", "Costi prestabiliti e allineati al valore, non al volume di lavoro."],
];

const featuredCases = [
  ["01", "Due diligence aumentata", "M&A · Legal intelligence", "Una due diligence trasformata in un sistema di conoscenza interrogabile, verificabile e orientato alla decisione."],
  ["02", "Compliance continua", "Governance · Regulatory monitoring", "Dalla verifica periodica a un presidio che monitora obblighi, scadenze e cambiamenti normativi."],
  ["03", "Contratti sotto controllo", "Commercial · Managed legal services", "Un patrimonio contrattuale organizzato per individuare rischi, ricorrenze e opportunità negoziali."],
];

export default function Home() {
  return (
    <main className="consultingHome">
      <section className="consultingHero">
        <Header dark={false} />
        <div className="consultingHeroInner wrap">
          <p className="consultingKicker">Legal intelligence · AI-first</p>
          <h1>Intelligence<br />with judgment</h1>
          <p className="consultingHeroCopy">Tecnologia, metodo e responsabilità professionale per trasformare più conoscenza in decisioni migliori.</p>
          <a className="pillButton" href="/chi-siamo">Scopri Vectis <span>→</span></a>
        </div>
      </section>

      <section className="consultingIntro consultingSection wrap">
        <p className="consultingKicker">Lo studio legale AI-first</p>
        <div className="consultingIntroGrid">
          <h2>Dal volume<br />al <em>valore.</em></h2>
          <div className="consultingCopy"><p className="bigCopy">Abbiamo riprogettato il lavoro legale attorno a ciò che crea davvero valore: il giudizio esperto.</p><p>L’intelligenza artificiale amplia la capacità di analisi e di ricerca. Il metodo struttura i processi. I professionisti interpretano il contesto, valutano il rischio e assumono la responsabilità della decisione.</p><a className="underLink" href="/chi-siamo">Il nostro modello <span>↗</span></a></div>
        </div>
      </section>

      <section className="methodFeature">
        <div className="wrap methodFeatureGrid">
          <div className="methodStatement"><p className="consultingKicker inverse">Come lavoriamo</p><h2>Ogni mandato<br />ha il suo <em>metodo.</em></h2><a className="pillButton pillLight" href="/metodo">Approfondisci <span>→</span></a></div>
          <div className="methodSteps">{[["01","Expert judgment"],["02","AI workflow"],["03","Knowledge"],["04","Quality review"],["05","Feedback loop"]].map(([n,t]) => <div key={n}><span>{n}</span><strong>{t}</strong></div>)}</div>
        </div>
      </section>

      <section className="practiceSection consultingSection"><div className="wrap">
        <div className="centerHeading"><p className="consultingKicker">Competenze</p><h2>Per le decisioni che<br />muovono l’impresa.</h2></div>
        <div className="consultingPractices">{practices.map(([n,t,d]) => <a href="/competenze" key={t} className="consultingPractice"><span>{n}</span><h3>{t}</h3><p>{d}</p><b>↗</b></a>)}</div>
        <div className="centerAction"><a className="pillButton" href="/competenze">Tutte le competenze <span>→</span></a></div>
      </div></section>

      <section className="homeCases consultingSection"><div className="wrap"><div className="caseHeading"><div><p className="consultingKicker inverse">Case Studies</p><h2>Il metodo,<br /><em>messo al lavoro.</em></h2></div><a className="pillButton pillLight" href="/case-studies">Vedi tutti i casi <span>→</span></a></div><div className="caseRail">{featuredCases.map(([n,t,k,d])=><a className="caseCard" href="/case-study" key={n}><span>{n}</span><p>{k}</p><h3>{t}</h3><div><p>{d}</p><b>↗</b></div></a>)}</div></div></section>

      <section className="outcomesSection consultingSection"><div className="wrap">
        <p className="consultingKicker inverse">Perché Vectis</p><h2>Più giudizio. Più controllo.<br /><em>Più prevedibilità.</em></h2>
        <div className="outcomesGrid">{outcomes.map(([t,d],i)=><article key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
      </div></section>

      <section className="audienceSection consultingSection wrap"><div className="centerHeading"><p className="consultingKicker">A chi ci rivolgiamo</p><h2>Decisioni tempestive.<br />Mai improvvisate.</h2></div><div className="audienceGrid"><div><strong>Gruppi industriali</strong><span>01</span></div><div><strong>PMI strutturate</strong><span>02</span></div><div><strong>Startup & scale-up</strong><span>03</span></div><div><strong>Fondi e realtà in trasformazione</strong><span>04</span></div></div></section>

      <section className="peopleBand"><div className="peoplePanel peoplePanelOne"><span>AM</span></div><div className="peopleCopy"><p className="consultingKicker inverse">Il team</p><h2>Le persone<br />dietro il giudizio.</h2><p>Esperienza professionale, responsabilità diretta e una cultura costruita per l’evoluzione del lavoro legale.</p><a className="pillButton pillLight" href="/team">Conosci il team <span>→</span></a></div><div className="peoplePanel peoplePanelTwo"><span>MG</span></div></section>

      <section className="finalStatement consultingSection wrap"><p className="consultingKicker">Parliamone</p><h2>Una decisione importante<br />merita il <em>giudizio giusto.</em></h2><a className="pillButton" href="mailto:musella@vectislegal.eu">Contattaci <span>→</span></a></section>
      <Footer />
    </main>
  );
}
