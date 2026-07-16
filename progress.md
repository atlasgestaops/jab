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
- [x] Correção do nó de JavaScript `Parser_de_Vagas` do Scraper no n8n para iterar de forma dinâmica sobre todas as fontes de busca cadastradas e associar corretamente as vagas.
- [x] Correção do nó `Reescrever_Descricao_IA` do Scraper no n8n para usar expressões de objeto JavaScript nativas (`{{ ... }}`), escapando caracteres especiais e quebras de linha nas descrições.
- [x] Configuração da chave de API real do Gemini e atualização do modelo de IA para o **Gemini 3.5 Flash** (modelo estável compatível com a chave de produção).
- [x] Implementação de timeout (30s) e resiliência ("On Error: Continue") no nó de IA do n8n, aplicando fallbacks automáticos para a descrição original em caso de instabilidade na requisição.
- [x] Configuração de CORS (`N8N_CORS_ALLOWED_ORIGINS: "*"`) e Timezone de Brasília (`America/Sao_Paulo`) no contêiner do n8n no Coolify para execução automática às 06:00 local e liberação de chamadas no painel.
- [x] Desenvolvimento da nova aba **"Vagas Ativas"** no painel administrativo e do componente `AdminActiveJobCard.tsx` com botão de exclusão e confirmação rápida.
- [x] Integração da rota de exclusão de vagas ativas no frontend com o endpoint `/vagas/moderacao` de backend no n8n (rejeitando e ocultando a vaga em tempo real).
- [x] Deploy final estável e homologado do portal público em [https://jab.atlasbot.tech](https://jab.atlasbot.tech), do painel administrativo e backend de APIs em [https://jab-api.atlasbot.tech](https://jab-api.atlasbot.tech).

### Bugs / Impedimentos:
- *Nenhum. O fluxo de triagem, raspagem de vagas automático diário com IA e controle de vagas ativas estão 100% integrados, testados e finalizados.*

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
