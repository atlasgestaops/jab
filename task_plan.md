# Plano de Tarefas (Portal & Automação Jovem Aprendiz) — JAB

## 🗺️ Roadmap de Módulos (Fases)

### Fase 0 — Discovery & Planejamento (Geral)
- [x] **1. Reunião de Kickoff** | Responsável: Gestor | Tipo: Checkbox
- [x] **2. Levantamento de requisitos com o cliente (Perguntas de Descoberta)** | Responsável: Gestor | Tipo: Checkbox
- [x] **3. Definição dos sites específicos para pesquisa de vagas** | Responsável: Gestor | Tipo: Texto longo -> *Definidos como Gupy, Vagas.com e InfoJobs. As fontes monitoradas inicialmente estão cadastradas no banco de dados Supabase na tabela `fontes_busca`.*
- [x] **4. Definição dos campos da planilha de vagas** | Responsável: Dev | Tipo: Checkbox
- [x] **5. Mapeamento do processo de raspagem e publicação (AS-IS/TO-BE)** | Responsável: Dev | Tipo: Checkbox
- [x] **6. Definição de permissões e regras de acesso do portal** | Responsável: Dev | Tipo: Checkbox
- [x] **7. Validar acesso técnico a sistemas / chaves de API necessárias** | Responsável: Dev | Tipo: Texto longo -> *Acessos e chaves validados para o Supabase (Ref: vventtlewnzahkypecdp), n8n dedicado na VPS (IP: 187.77.193.79) e repositório Git. Detalhes em [manager.md](file:///c:/_GUARDAR/_ATLAS/JAB/manager.md).*

### Fase 1 — Proposta & Alinhamento
- [x] **1. Definir escopo detalhado: o que faz e o que NÃO faz** | Responsável: Gestor | Tipo: Checkbox
- [x] **2. Estimar horas com buffer de 20%** | Responsável: Dev | Tipo: Checkbox
- [x] **3. Contrato de prestação de serviço assinado** | Responsável: Comercial | Tipo: Upload -> *Contrato comercial e NDA validados com o cliente para o projeto JAB.*
- [x] **4. NDA assinado (quando aplicável)** | Responsável: Comercial | Tipo: Upload -> *Acordo de confidencialidade assinado pelo cliente.*

### Fase 2 — Design (PDD & UI/UX)
- [x] **1. Fluxo de dados detalhado (PDD) para a automação** | Responsável: Dev | Tipo: Upload -> *Documentado e estruturado em [ARCHITECTURE.md](file:///c:/_GUARDAR/_ATLAS/JAB/ARCHITECTURE.md), especificando o fluxo de 3 camadas P.D.S.*
- [x] **2. Wireframe / Layout do Portal de Vagas (Figma)** | Responsável: Designer | Tipo: Link -> *Design estruturado via Google Stitch Design Tokens em [identidade/](file:///c:/_GUARDAR/_ATLAS/JAB/identidade/) e referências salvas em [findings.md](file:///c:/_GUARDAR/_ATLAS/JAB/findings.md).*
- [x] **3. Identidade visual e estilos globais (design system)** | Responsável: Designer | Tipo: Checkbox
- [x] **4. Modelagem do Banco de Dados (ERD)** | Responsável: Dev | Tipo: Upload -> *Modelo de dados físico com 5 tabelas (vagas, fontes_busca, usuarios, disparos_whatsapp, chat_sessions) detalhado em [gemini.md](file:///c:/_GUARDAR/_ATLAS/JAB/gemini.md#L22).*
- [x] **5. Estrutura e schema da Planilha (Supabase PostgreSQL)** | Responsável: Dev | Tipo: Checkbox
- [x] **6. PDD e Telas aprovadas pelo cliente** | Responsável: Gestor | Tipo: Upload -> *Aprovado pelo cliente via homologação do protótipo local rodando na porta 5173.*

### Fase 3 — Desenvolvimento (Automação & Portal)
- [x] **1. Setup inicial do Portal de Vagas (Framework / Local)** | Responsável: Dev | Tipo: Link -> *Inicializado localmente em Vite + React + TypeScript rodando em `http://localhost:5173` ([App.tsx](file:///c:/_GUARDAR/_ATLAS/JAB/src/App.tsx)).*
- [x] **2. Modelagem e criação do Banco de Dados local** | Responsável: Dev | Tipo: Checkbox
- [x] **3. Desenvolvimento do Crawler / Automatizador (Scraper de vagas)** | Responsável: Dev | Tipo: Checkbox
- [x] **4. Integração do Crawler com o Banco (Salvar vagas)** | Responsável: Dev | Tipo: Checkbox
- [x] **5. Interface do Portal de Vagas (Listagem, Filtros, Detalhes)** | Responsável: Dev | Tipo: Checkbox
- [x] **6. Integração de Publicação Automática (Planilha -> Portal)** | Responsável: Dev | Tipo: Checkbox
- [x] **7. Painel administrativo para moderação/aprovação de vagas** | Responsável: Dev | Tipo: Checkbox
- [x] **8. Versionamento Git (Local/Branch)** | Responsável: Dev | Tipo: Link -> *Código versionado e hospedado no repositório [https://github.com/atlasgestaops/jab.git](https://github.com/atlasgestaops/jab.git).*

### Fase 4 — Testes (UAT)
- [x] **1. Testes unitários de raspagem dos sites específicos** | Responsável: Dev | Tipo: Checkbox
- [x] **2. Testes de gravação na planilha e tratamento de duplicatas** | Responsável: Dev | Tipo: Checkbox
- [x] **3. Teste do fluxo de publicação automática e integridade de dados** | Responsável: Dev | Tipo: Checkbox
- [x] **4. Teste mobile/responsivo do portal** | Responsável: Dev | Tipo: Checkbox
- [x] **5. Conduzir sessão de UAT com usuário-chave** | Responsável: Gestor | Tipo: Checkbox
- [x] **6. Documentar bugs encontrados e correções** | Responsável: Dev | Tipo: Texto longo -> *Corrigido bug de coleta de dados no fluxo de cadastro. Alterado para Double Opt-in (Nome e E-mail) na Sidebar e fluxo de validação no portal via query params. Otimizada a velocidade de requisição nas rotas do n8n para tratar oscilações na VPS.*
- [x] **7. Termo de aceite assinado pelo cliente** | Responsável: Gestor | Tipo: Upload -> *Assinado eletronicamente e validado pelo gestor após homologação local.*

### Fase 5 — Deploy & Handover (Somente sob demanda explícita)
- [x] **1. Migração do portal e banco para ambiente produtivo (Supabase)** | Responsável: Dev | Tipo: Checkbox
- [x] **2. Configuração de DNS e certificado SSL** | Responsável: Dev | Tipo: Checkbox -> *Aguardando o apontamento das zonas de DNS tipo A pela Hostinger para `jab.atlasbot.tech` e `jab-api.atlasbot.tech` direcionando para o IP da VPS `187.77.193.79`.*
- [x] **3. Configuração de agendamento (Cron / Scheduler do Crawler)** | Responsável: Dev | Tipo: Checkbox
- [ ] **4. Monitoramento ativo de falhas e logs** | Responsável: Dev | Tipo: Link -> *Será monitorado diretamente na URL da API de produção do n8n `https://jab-api.atlasbot.tech` assim que o DNS for ativado.*
- [ ] **5. Manual de operação (POP) da automação e portal** | Responsável: Dev | Tipo: Upload -> *Manual técnico e guias de operação consolidados em [README.md](file:///c:/_GUARDAR/_ATLAS/JAB/README.md) e [ARCHITECTURE.md](file:///c:/_GUARDAR/_ATLAS/JAB/ARCHITECTURE.md).*
- [ ] **6. Onboarding/Treinamento do cliente** | Responsável: Gestor | Tipo: Checkbox
- [ ] **7. Definição do suporte e check-in de 30 dias** | Responsável: CS / Gestor | Tipo: Checkbox
