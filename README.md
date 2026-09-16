# Vectis — Content Wireframe

Wireframe navigabile del sito corporate Vectis, realizzato in Next.js e predisposto per il deploy su Vercel.

## Sviluppo locale

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Commenti condivisi

La modalità review si attiva dal pulsante `Commenta` presente nel sito e richiede una password. Senza database usa il salvataggio locale del browser; con Neon collegato a Vercel usa automaticamente l’archivio condiviso.

Variabili richieste in Vercel:

- `DATABASE_URL` (creata dall’integrazione Neon)
- `REVIEW_ACCESS_PASSWORD` (password condivisa con cliente e revisori)
- `REVIEW_ADMIN_PASSWORD` (password scelta per `/review-admin`)

La tabella dei commenti viene inizializzata automaticamente alla prima richiesta. I commenti locali presenti nel browser vengono importati al primo collegamento al database.
