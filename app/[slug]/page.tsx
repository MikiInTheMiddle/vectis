import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer, Header } from "../site-components";

const pageInfo = {
  "chi-siamo": { kicker: "Chi siamo", title: "Due avvocati. Due esperienze. Un progetto.", intro: "Vectis Legal STA integra esperienza legale, progettazione dei processi e competenze AI in uno studio costruito per l’evoluzione della professione." },
  metodo: { kicker: "Il metodo Vectis", title: "Intelligence with Judgment.", intro: "L’AI recupera e struttura la conoscenza. L’avvocato valuta, approva e assume la responsabilità della decisione." },
  competenze: { kicker: "Competenze", title: "Per il mondo corporate.", intro: "Affianchiamo imprese, management e funzioni legali interne con assistenza qualificata, tempestiva e continuativa." },
  "vectis-inhouse": { kicker: "Deep dive", title: "Vectis inHouse.", intro: "Un presidio legale continuativo che affianca il management e la funzione legale esistente quando la soluzione non può aspettare." },
  "case-studies": { kicker: "Case Studies", title: "Il metodo, nella pratica.", intro: "Una struttura pronta a documentare casi reali attraverso contesto, metodo, giudizio professionale e impatto." },
  "case-study": { kicker: "Template di caso · contenuto da completare", title: "Anatomia di una case history.", intro: "Il modello editoriale predisposto per raccontare un caso reale senza anticipare clienti, dati o risultati non ancora disponibili." },
  team: { kicker: "La STA e il team", title: "Il giudizio è umano. La capacità è aumentata.", intro: "Una società tra avvocati costruita come struttura, non come somma di nomi." },
} as const;

const values = [
  ["01","AI come metodo, non come fine","Automazione strutturata delle attività scalabili per potenziare il giudizio dei professionisti."],
  ["02","Evoluzione del lavoro legale","Tecnologia e competenza convergono in un modello più fluido, senza sostituire il ragionamento giuridico."],
  ["03","Human-Led Judgment","Strategia, supervisione e responsabilità professionale guidano ogni decisione."],
  ["04","Valore, non volume","Maggiore profondità analitica e decisioni più solide. L’efficienza operativa è una conseguenza."],
  ["05","Tempestività senza compromessi","Tempi di risposta rapidi senza sacrificare qualità e accuratezza del giudizio professionale."],
];

const process = [
  ["01","Expert Judgement","Il partner e il team legale analizzano le esigenze e definiscono obiettivi, tempi e modalità di lavoro."],
  ["02","AI Workflow","I Legal AI Specialist attivano una pipeline specializzata sui contenuti del mandato, con informazioni segregate per pratica e cliente."],
  ["03","Knowledge","L’AI recupera la conoscenza disponibile e rilevante: storico del cliente, precedenti di studio e ricerca legale."],
  ["04","Execution & Quality Review","Gli avvocati eseguono il mandato, assumono la responsabilità diretta della pratica e concludono le attività con una revisione interna."],
  ["05","Feedback Loop","Ogni incarico arricchisce il sistema di Legal AI dello studio, migliorando la conoscenza del cliente e la qualità del servizio."],
];

const advantages = [
  ["01","Qualità della decisione","Più capacità cognitiva, informazioni e analisi significano maggiori opzioni e decisioni migliori."],
  ["02","Tempestività","Tempi di risposta rapidi e certi, senza compromettere qualità e accuratezza."],
  ["03","Accuratezza e Risk Control","Valutazioni strutturate aumentano profondità, copertura e affidabilità decisionale."],
  ["04","Costi chiari e preventivabili","Costi prestabiliti e concordati, misurabili e allineati al valore, non al volume di lavoro."],
];

const expertise = [
  {n:"01",title:"Operazioni straordinarie",subtitle:"Decisioni complesse, informazioni leggibili.",doing:"Fusioni / Acquisizioni / Riorganizzazioni societarie / Due diligence",change:"Una pipeline dedicata ordina la conoscenza rilevante per il mandato. L’avvocato collega le evidenze, valuta il rischio e governa la decisione.",caseTitle:"Case history da integrare"},
  {n:"02",title:"Diritto societario e compliance integrata",subtitle:"Governance e controllo in un unico quadro.",doing:"Corporate governance / Segreteria societaria / Sistemi di controllo interno / Programmi di compliance integrata",change:"Informazioni, obblighi e responsabilità confluiscono in workflow verificabili. Il giudizio professionale traduce il quadro in azioni coerenti.",caseTitle:"Case history da integrare"},
  {n:"03",title:"Contrattualistica commerciale",subtitle:"Negoziare con più conoscenza disponibile.",doing:"Drafting / Revisione contrattuale / Negoziazione",change:"L’AI recupera precedenti e informazioni pertinenti. L’avvocato interpreta il contesto, definisce la posizione negoziale e approva il risultato.",caseTitle:"Case history da integrare"},
  {n:"04",title:"Normativa AI",subtitle:"Conformità alla regolazione dell’intelligenza artificiale.",doing:"Analisi del perimetro normativo / Governance AI / Valutazione dei rischi / Supporto alla conformità",change:"La regolazione viene tradotta in ruoli, controlli ed evidenze applicabili. La valutazione legale resta al centro dell’adozione dell’AI.",caseTitle:"Case history da integrare"},
  {n:"05",title:"Vectis inHouse / Managed Legal Services",subtitle:"Un presidio continuativo per decidere prima dell’urgenza.",doing:"Contrattualistica corrente / Governance / Compliance e privacy / Normativa AI / Monitoraggio regolatorio",change:"Vectis affianca il management e la funzione legale esistente con un centro di conoscenza dedicato e workflow strutturati. Il Regulatory Monitoring opera qui come capacità trasversale.",caseTitle:"Case history da integrare",deepDive:true},
];

const casePlaceholders = [
  ["01","Case history da integrare","Operazioni straordinarie","Contesto, sfida, metodo AI e legale, giudizio professionale, impatto."],
  ["02","Case history da integrare","Vectis inHouse","Un futuro caso di presidio continuativo, collegato alla relativa area di competenza."],
  ["03","Case history da integrare","Normativa AI","Un futuro caso concreto, documentato senza trasformare il servizio in una case history."],
];

function AboutPage() { return <>
  <section className="aboutOpening internalSection"><div className="wrap internalSplit"><h2>Origini diverse.<br /><em>Una direzione comune.</em></h2><div><p className="bigCopy">I fondatori hanno maturato per decenni esperienza nel diritto d’impresa, all’interno di gruppi societari e studi legali internazionali.</p><p>Competenze complementari hanno dato forma a un progetto capace di guidare l’evoluzione della professione legale attraverso un impiego strutturato della Legal AI.</p></div></div></section>
  <section className="internalEditorial internalSection wrap"><p className="consultingKicker">L’evoluzione del progetto</p><div className="internalSplit"><h2>Dal partner di innovazione<br /><em>allo studio AI First.</em></h2><div><p className="bigCopy">Nel 2024 prende forma Vectis Legal Innovation Partner. Nel 2026 il progetto evolve in Vectis Legal STA.</p><p>La società tra avvocati integra esperienza legale, progettazione dei processi e competenze AI in un modello operativo unitario.</p></div></div></section>
  <section className="principlesBlock internalSection"><div className="wrap"><div className="centerHeading"><p className="consultingKicker inverse">Cosa significa AI First</p><h2>Persone, processi e tecnologia.<br />Nello stesso metodo.</h2></div><div className="principleGrid principleGridThree">{[["01","Artificial Intelligence","Potenzia analisi e ricerca della conoscenza."],["02","Legal Method","Struttura i workflow e governa i processi."],["03","Professional Judgment","Interpreta il contesto, valuta il rischio e assume la responsabilità."]].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
  <section className="internalQuote internalSection wrap"><p>“L’efficienza è una conseguenza del metodo, non l’obiettivo.”</p><span>Vectis Legal STA</span></section>
</>; }

function MethodPage() { return <>
  <section className="internalEditorial internalSection wrap"><p className="consultingKicker">AI + Professional Judgment</p><div className="internalSplit"><h2>Intelligence,<br />poi <em>Judgment.</em></h2><div><p className="bigCopy">L’AI recupera informazioni, struttura analisi e rende disponibili opzioni.</p><p>L’avvocato valuta, sceglie e approva. Nessun output raggiunge il cliente senza un giudizio professionale.</p></div></div></section>
  <section className="principlesBlock internalSection"><div className="wrap"><div className="centerHeading"><p className="consultingKicker inverse">I valori</p><h2>Il metodo prima<br />della tecnologia.</h2></div><div className="principleGrid principleGridFive">{values.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
  <section className="processIntro internalSection wrap"><p className="consultingKicker">Il workflow</p><h2>Cinque passaggi.<br /><em>Un sistema che apprende.</em></h2></section>
  <section className="processRows wrap">{process.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</section>
  <section className="methodOutcome internalSection"><div className="wrap"><p className="consultingKicker">La nostra competitività</p><div className="advantageGrid">{advantages.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
</>; }

function ExpertisePage() { return <>
  <section className="expertiseIntro internalSection wrap"><p className="consultingKicker">Aree di attività</p><div className="internalSplit"><h2>Competenze legali.<br /><em>Capacità aumentata.</em></h2><p className="bigCopy">Il perimetro resta quello del diritto d’impresa. Cambia il modo in cui conoscenza, processo e giudizio lavorano insieme.</p></div></section>
  <section className="expertiseAccordion">{expertise.map((item,i)=><details name="expertise" className="expertiseRow" key={item.n} open={i===0}><summary><span>{item.n}</span><div><h3>{item.title}</h3><p>{item.subtitle}</p></div><b aria-hidden="true">+</b></summary><div className="expertiseExpanded"><div><span>Cosa facciamo</span><p>{item.doing}</p></div><div><span>Come cambia con Vectis</span><p>{item.change}</p>{item.deepDive?<a className="underLink" href="/vectis-inhouse">Approfondisci Vectis inHouse <b>→</b></a>:null}</div><div><span>Selected Case</span><a href="/case-study">{item.caseTitle} <b>→</b></a></div></div></details>)}</section>
</>; }

function InHousePage() { return <>
  <section className="internalEditorial internalSection wrap"><p className="consultingKicker">Il problema</p><div className="internalSplit"><h2>Decidere prima<br /><em>dell’urgenza.</em></h2><div><p className="bigCopy">Il management deve poter valutare tempestivamente i rischi legali e adottare rimedi adeguati prima che il problema sia già esploso.</p><p>Anche una funzione legale strutturata attraversa momenti in cui occorre recuperare rapidamente conoscenza, capire il quadro e decidere.</p></div></div></section>
  <section className="inHouseModel internalSection"><div className="wrap"><p className="consultingKicker inverse">Il modello</p><h2>Vectis affianca.<br />Non sostituisce.</h2><p>Il presidio lavora con il management e con la funzione legale esistente, raccogliendo la conoscenza dell’organizzazione, del business e dei rapporti con clienti e fornitori.</p></div></section>
  <section className="internalEditorial internalSection wrap"><p className="consultingKicker">Il sistema</p><div className="internalSplit"><h2>Un centro di conoscenza<br /><em>dedicato.</em></h2><div><p className="bigCopy">AI e workflow strutturati organizzano le informazioni rilevanti per l’impresa.</p><p>Quando emerge un’esigenza, il sistema recupera le informazioni e supporta gli approfondimenti. L’avvocato valuta il quadro ed elabora le indicazioni da sottoporre al management.</p></div></div></section>
  <section className="processIntro internalSection wrap"><p className="consultingKicker">Come funziona</p><h2>Dall’informazione<br /><em>alla decisione.</em></h2></section>
  <section className="processRows wrap inHouseSteps">{[["01","Recupero","Le informazioni necessarie vengono individuate nel centro di conoscenza dedicato."],["02","Approfondimento","AI e workflow aiutano a costruire una visione completa e strutturata del problema."],["03","Valutazione","L’avvocato interpreta il contesto, valuta il rischio e formula le indicazioni."],["04","Decisione","Il management riceve gli elementi per decidere in modo tempestivo e adeguato."]].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</section>
  <section className="inHouseScope internalSection"><div className="wrap"><p className="consultingKicker">Cosa copriamo</p><div className="scopeGrid">{["Contrattualistica corrente","Governance societaria","Compliance e privacy","Normativa AI","Monitoraggio regolatorio"].map((item,i)=><div key={item}><span>0{i+1}</span><strong>{item}</strong></div>)}</div><p className="bigCopy">Un solo punto di riferimento, non uno diverso per ogni materia.</p></div></section>
</>; }

function CasesPage() { return <><section className="casesIntro internalSection wrap"><p className="consultingKicker">Selected work</p><div className="internalSplit"><h2>Casi reali.<br /><em>Metodo verificabile.</em></h2><p className="bigCopy">I contenuti dei casi non sono ancora disponibili. La sezione resta pronta a riceverli senza inventare clienti, dati o risultati.</p></div></section><section className="casesIndex">{casePlaceholders.map(([n,t,k,d])=><article id={`case-${n}`} key={n}><a href="/case-study" className="wrap caseIndexRow"><span>{n}</span><div><p>{k}</p><h3>{t}</h3></div><p>{d}</p><b>↗</b></a></article>)}</section></>; }

function CaseStudyPage() { const sections=[["01 · Context","Il contesto del cliente e dell’incarico."],["02 · Challenge","La decisione da assumere, i vincoli e la complessità da gestire."],["03 · Vectis Approach","Il modo in cui Vectis ha strutturato il mandato."],["04 · AI / Legal Method","La pipeline, le fonti e i controlli applicati."],["05 · Professional Judgment","Le valutazioni affidate agli avvocati e la responsabilità assunta."],["06 · Impact","Gli effetti documentabili del lavoro, senza metriche non verificate."]]; return <><section className="caseFacts internalSection"><div className="wrap"><p className="consultingKicker">Stato del contenuto</p><div className="caseFactsGrid"><div><span>Cliente</span><strong>Da definire</strong></div><div><span>Ambito</span><strong>Da definire</strong></div><div><span>Periodo</span><strong>Da definire</strong></div><div><span>Stato</span><strong>Template editoriale</strong></div></div></div></section><section className="caseTemplate internalSection wrap">{sections.map(([title,text])=><article key={title}><span>{title}</span><p>{text}</p></article>)}</section><section className="caseOutcome internalSection wrap"><p className="consultingKicker">Related Expertise</p><div className="internalSplit"><h2>Competenza collegata<br /><em>da associare.</em></h2><div><p className="bigCopy">Ogni caso reale rimanderà all’area di competenza pertinente.</p><a className="underLink" href="/competenze">Vai alle competenze <span>→</span></a></div></div><p className="caseDisclaimer">Contenuto provvisorio. Nessun cliente, incarico o risultato è rappresentato in questa pagina.</p></section></>; }

function TeamPage() { return <>
  <section className="internalEditorial internalSection wrap"><p className="consultingKicker">Perché una STA</p><div className="internalSplit"><h2>La forma segue<br /><em>la sostanza.</em></h2><div><p className="bigCopy">La Società Tra Avvocati definisce una struttura con organizzazione e regole di governo chiare.</p><p>Vectis è pensata per durare e integrare competenze diverse in un metodo comune, non per sommare professionisti.</p></div></div></section>
  <section className="consultantTeam wrap"><article><div className="consultantPortrait portraitOne"><span>AM</span></div><p>Fondatore & Managing Partner</p><h3>Alessandro Musella</h3><a href="mailto:musella@vectislegal.eu">Contatta ↗</a></article><article><div className="consultantPortrait portraitTwo"><span>MG</span></div><p>Fondatore e Presidente Esecutivo</p><h3>Mauro Gigante</h3><a href="mailto:gigante@vectislegal.eu">Contatta ↗</a></article></section>
  <section className="teamCulture internalSection"><div className="wrap internalSplit"><h2>Un team,<br /><em>non una somma di nomi.</em></h2><div><p className="bigCopy">Professionisti legali e specialisti AI lavorano nello stesso processo.</p><p>Strategia, supervisione e responsabilità restano in capo agli avvocati. I profili degli specialisti AI saranno integrati quando saranno disponibili.</p></div></div></section>
</>; }

export function generateStaticParams() { return Object.keys(pageInfo).map(slug => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> { const {slug}=await params; const page=pageInfo[slug as keyof typeof pageInfo]; if(!page) return {}; return { title: page.title, description: page.intro, openGraph:{title:`${page.title} | Vectis`,description:page.intro,images:[]},twitter:{title:`${page.title} | Vectis`,description:page.intro,images:[]}}; }

export default async function DetailPage({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params; const page = pageInfo[slug as keyof typeof pageInfo]; if (!page) notFound();
  return <main className="consultingInternal"><section className="internalConsultingHero"><Header dark={false}/><div className="wrap"><p className="consultingKicker">{page.kicker}</p><h1>{page.title}</h1><p>{page.intro}</p></div></section>{slug==="chi-siamo"?<AboutPage/>:slug==="metodo"?<MethodPage/>:slug==="competenze"?<ExpertisePage/>:slug==="vectis-inhouse"?<InHousePage/>:slug==="case-studies"?<CasesPage/>:slug==="case-study"?<CaseStudyPage/>:<TeamPage/>}<Footer/></main>;
}
