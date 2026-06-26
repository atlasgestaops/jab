# Log de Progresso — JAB (Portal de Vagas e Automação de Jovem Aprendiz)

## 📅 Sprint Atual: Sprint 2 (Migração de Produção e Homologação)

### O que foi feito:
- [x] Criação e validação do banco de dados relacional no Supabase (`vventtlewnzahkypecdp`) contendo as 5 tabelas do sistema.
- [x] Ajuste do fluxo de cadastro do usuário para Double Opt-in (Nome/E-mail) no frontend e validação automática por token.
- [x] Implementação da área do candidato para configuração e monitoramento do bot de WhatsApp.
- [x] Refatoração e modularização completa dos 5 workflows do n8n dedicados migrados para consultas nativas PostgreSQL no Supabase.
- [x] Criação das configurações de conteinerização de produção usando Nginx ([Dockerfile.prod](file:///c:/_GUARDAR/_ATLAS/JAB/Dockerfile.prod) e [nginx.conf](file:///c:/_GUARDAR/_ATLAS/JAB/nginx.conf)).
- [x] Versionamento e envio da branch `main` do projeto local para o repositório remoto no GitHub.
- [x] Sincronização inicial e deploys criados no painel do Coolify para `jab-frontend` e `jab-n8n`.
- [x] Atualização e preenchimento detalhado do `task_plan.md` e do `manager.md` para integração com a plataforma de SaaS.

### Bugs / Impedimentos:
- **Aguardando DNS:** O deploy online em produção e o SSL do n8n e do portal dependem do apontamento DNS dos registros tipo A (`jab` e `jab-api`) na conta da Hostinger do usuário.

---

## 📅 Sprint Anterior: Sprint 1 (Inicialização & Protótipo)

### O que foi feito:
- [x] Criação da estrutura base de pastas e arquivos do Protocolo VLAEG.
- [x] Resposta às perguntas de descoberta pelo usuário.
- [x] Definição do modelo de dados inicial e regras de negócio no `gemini.md`.
- [x] Criação dos blueprints de workflow do n8n para raspagem e limpeza de vagas.
- [x] Criação de estilos globais CSS Vanilla e tokens da marca JAB.
- [x] Criação dos componentes React (Header, JobCard, AdminJobCard, JobModal, AdBlock).
- [x] Configuração e criação do Dockerfile e .dockerignore para contêiner local.
- [x] Build bem-sucedido da imagem Docker local `jab`.
- [x] Execução estável do contêiner Docker `jab` mapeado na porta `5173`.
- [x] Geração e entrega do relatório de Walkthrough inicial do projeto.
