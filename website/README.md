# Jovem Aprendiz Brasil — MVP de Vagas

MVP mobile-first (Next.js App Router + Tailwind) inspirado em portais de vagas como CIEE, com cards leves, busca (frontend) e página de detalhes.

## Stack

- Next.js (App Router)
- Tailwind CSS
- TypeScript

## Estrutura

- `src/app/`: rotas (Home, detalhes, SEO)
- `src/components/`: componentes reutilizáveis (`JobCard`, `Header`, `SearchBar`, `AdBanner`)
- `src/data/`: dados mock (`jobs.json`)
- `src/lib/`: utilitários de dados (base para futura integração com CMS)
- `src/styles/`: estilos globais (Tailwind)

## Como rodar (Windows)

1) Instale o Node.js LTS (inclui `node` e `npm`) pelo site oficial: `https://nodejs.org/`

2) No terminal, dentro da pasta do projeto:

```bash
npm install
npm run dev
```

3) Abra `http://localhost:3000`

## Onde editar as vagas

Edite o arquivo:

- `src/data/jobs.json`

## Próximos passos (para escalar)

- Persistir filtros via querystring (URL) e/ou server-side filtering
- Trocar `src/lib/jobs.ts` para consumir CMS/API mantendo a mesma interface de dados
- Integrar formulário/ATS no botão “Candidatar-se”

