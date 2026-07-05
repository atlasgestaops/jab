# Log de Progresso — JAB (Portal de Vagas e Automação de Jovem Aprendiz)

## 📅 Sprint Atual: Sprint 2 (Migração de Produção e Homologação)

### O que foi feito:
- [x] Criação e validação do banco de dados relacional no Supabase contendo todas as tabelas do sistema.
- [x] Ajuste do fluxo de cadastro do usuário para Double Opt-in (Nome/E-mail) no frontend e validação automática por token.
- [x] Implementação da área do candidato para configuração e monitoramento do bot de WhatsApp.
- [x] Refatoração e modularização completa dos 5 workflows do n8n dedicados migrados para consultas nativas PostgreSQL no Supabase.
- [x] Conexão remota bem-sucedida do servidor n8n da VPS via MCP local.
- [x] Resolução automática e manual de 19 erros de sintaxe nos nós e queries SQL do n8n remoto da VPS.
- [x] Associação e fixação de credenciais do PostgreSQL em todos os 10 nós de banco de dados do n8n.
- [x] Contorno do bloqueio de rede IPv6 do Supabase configurando o Connection Pooler (Session Mode) em IPv4 na porta 5432.
- [x] Resolução do erro de cadeia de certificados SSL auto-assinados no n8n.
- [x] Cadastro da empresa mock (`guest_company_id`) no Supabase para viabilizar testes manuais de ponta a ponta sem violação de chaves estrangeiras.
- [x] Normalização de respostas do n8n webhook no React (suporte a objeto único no retorno de 1 vaga).
- [x] Ajuste no `tsconfig.app.json` para permitir variáveis declaradas mas não lidas no build de produção.
- [x] Deploy estável e homologado do portal público em [https://jab.atlasbot.tech](https://jab.atlasbot.tech) e backend de APIs em [https://jab-api.atlasbot.tech](https://jab-api.atlasbot.tech).

### Bugs / Impedimentos:
- *Nenhum no momento. A infraestrutura básica e a API Backend (fluxo principal) estão 100% integradas e funcionais em produção.*

---

## 📅 Sprint Anterior: Sprint 1 (Inicialização & Protótipo)

### O que foi feito:
- [x] Criação da estrutura base de pastas e arquivos do Protocolo VLAEG.
- [x] Definição do modelo de dados inicial e regras de negócio no `gemini.md`.
- [x] Criação dos blueprints de workflow do n8n para raspagem e limpeza de vagas.
- [x] Criação de estilos globais CSS Vanilla e tokens da marca JAB.
- [x] Criação dos componentes React (Header, JobCard, AdminJobCard, JobModal, AdBlock).
- [x] Build bem-sucedido da imagem Docker local `jab`.
- [x] Geração e entrega do relatório de Walkthrough inicial do projeto.
