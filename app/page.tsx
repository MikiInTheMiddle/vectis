import { Footer, Header } from "./site-components";

const practices = [
  ["01", "Operazioni straordinarie", "Fusioni, acquisizioni, riorganizzazioni societarie e due diligence."],
  ["02", "Diritto societario e compliance integrata", "Governance, segreteria societaria, controlli interni e programmi di compliance."],
  ["03", "Contrattualistica commerciale", "Drafting, revisione contrattuale e negoziazione."],
  ["04", "Normativa AI", "Conformità alla regolazione dell’intelligenza artificiale."],
  ["05", "Vectis inHouse", "Un presidio legale continuativo per il management e le funzioni legali interne."],
];

const outcomes = [
  ["Qualità della decisione", "Più conoscenza rilevante e maggiore profondità di analisi ampliano le opzioni di scelta."],
  ["Tempestività", "Tempi di risposta rapidi e certi, senza compromettere qualità e accuratezza."],
  ["Accuratezza e Risk Control", "Valutazioni strutturate aumentano profondità, copertura e affidabilità decisionale."],
  ["Costi chiari", "Costi prestabiliti e concordati, misurabili e allineati al valore."],
];

const featuredCases = [
  ["01", "Case history in definizione", "Operazioni straordinarie", "Struttura predisposta per documentare contesto, metodo applicato, giudizio professionale e impatto."],
  ["02", "Case history in definizione", "Vectis inHouse", "Struttura pronta a raccontare un presidio continuativo senza anticipare dati o risultati non disponibili."],
  ["03", "Case history in definizione", "Normativa AI", "Spazio riservato a un caso reale, collegato alla competenza e verificabile nei suoi passaggi."],
];

export default function Home() {
  return (
    <main className="consultingHome">
      <section className="consultingHero">
        <Header dark={false} />
        <div className="consultingHeroInner wrap">
          <p className="consultingKicker">Vectis Legal STA · AI First</p>
          <h1>Intelligence<br />with judgment</h1>
          <p className="consultingHeroCopy">Intelligenza artificiale, metodo legale e giudizio professionale per decisioni migliori.</p>
        </div>
      </section>

      <section className="consultingIntro consultingSection wrap">
        <p className="consultingKicker">Lo studio legale AI First</p>
        <div className="consultingIntroGrid">
          <h2>Dal volume<br />al <em>valore.</em></h2>
          <div className="consultingCopy"><p className="bigCopy">Abbiamo riprogettato il lavoro legale attorno a ciò che crea valore: il giudizio esperto.</p><p>L’AI amplia la capacità di analisi e ricerca. Il metodo governa i processi. I professionisti interpretano il contesto, valutano il rischio e assumono la responsabilità della decisione.</p><a className="underLink" href="/chi-siamo">Chi siamo <span>↗</span></a></div>
        </div>
      </section>

      <section className="methodFeature">
        <div className="wrap methodFeatureGrid">
          <div className="methodStatement"><p className="consultingKicker inverse">Come lavoriamo</p><h2>AI + Professional<br /><em>Judgment.</em></h2><a className="pillButton pillLight" href="/metodo">Approfondisci <span>→</span></a></div>
          <div className="methodSteps">{[["01","Expert Judgement"],["02","AI Workflow"],["03","Knowledge"],["04","Execution & Quality Review"],["05","Feedback Loop"]].map(([n,t]) => <div key={n}><span>{n}</span><strong>{t}</strong></div>)}</div>
        </div>
      </section>

      <section className="practiceSection consultingSection"><div className="wrap">
        <div className="centerHeading"><p className="consultingKicker">Competenze</p><h2>Per il mondo<br />corporate.</h2></div>
        <div className="consultingPractices">{practices.map(([n,t,d]) => <a href={t === "Vectis inHouse" ? "/vectis-inhouse" : "/competenze"} key={t} className="consultingPractice"><span>{n}</span><h3>{t}</h3><p>{d}</p><b>↗</b></a>)}</div>
        <div className="centerAction"><a className="pillButton" href="/competenze">Tutte le competenze <span>→</span></a></div>
      </div></section>

      <section className="homeCases consultingSection"><div className="wrap"><div className="caseHeading"><div><p className="consultingKicker inverse">Case Studies</p><h2>Il metodo,<br /><em>messo al lavoro.</em></h2></div><a className="pillButton pillLight" href="/case-studies">Vedi la struttura <span>→</span></a></div><div className="caseRail">{featuredCases.map(([n,t,k,d])=><a className="caseCard" href="/case-study" key={n}><span>{n}</span><p>{k}</p><h3>{t}</h3><div><p>{d}</p><b>↗</b></div></a>)}</div></div></section>

      <section className="outcomesSection consultingSection"><div className="wrap">
        <p className="consultingKicker inverse">La nostra competitività</p><h2>Più giudizio. Più controllo.<br /><em>Più prevedibilità.</em></h2>
        <div className="outcomesGrid">{outcomes.map(([t,d],i)=><article key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
      </div></section>

      <section className="audienceSection consultingSection wrap"><div className="centerHeading"><p className="consultingKicker">Per chi lavoriamo</p><h2>Decisioni tempestive.<br />Mai improvvisate.</h2></div><div className="audienceGrid"><div><strong>Società e gruppi industriali e di servizi</strong><span>01</span></div><div><strong>PMI strutturate</strong><span>02</span></div><div><strong>Startup e scale-up</strong><span>03</span></div><div><strong>Fondi e realtà in trasformazione</strong><span>04</span></div></div><p className="audienceNote">Lavoriamo a diretto contatto con il management e affianchiamo le funzioni legali interne, senza sostituirle né scavalcarle.</p></section>

      <section className="peopleBand"><div className="peoplePanel peoplePanelOne"><span>AM</span></div><div className="peopleCopy"><p className="consultingKicker inverse">La STA e il team</p><h2>Il giudizio è umano.<br />La capacità è aumentata.</h2><p>Una struttura in cui professionisti legali e specialisti AI lavorano nello stesso processo, con ruoli e responsabilità chiari.</p><a className="pillButton pillLight" href="/team">Conosci il team <span>→</span></a></div><div className="peoplePanel peoplePanelTwo"><span>MG</span></div></section>

      <section className="finalStatement consultingSection wrap"><p className="consultingKicker">Parliamone</p><h2>Una decisione importante<br />merita il <em>giudizio giusto.</em></h2><a className="pillButton" href="mailto:musella@vectislegal.eu">Contattaci <span>→</span></a></section>
      <Footer />
    </main>
  );
}
