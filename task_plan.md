# Plano de Tarefas (Portal & Automação Jovem Aprendiz) — JAB

## 🗺️ Roadmap de Módulos (Fases)

### Fase 0 — Discovery & Planejamento (Geral)
- [ ] **1. Reunião de Kickoff** | Responsável: Gestor | Tipo: Checkbox
- [ ] **2. Levantamento de requisitos com o cliente (Perguntas de Descoberta)** | Responsável: Gestor | Tipo: Checkbox
- [ ] **3. Definição dos sites específicos para pesquisa de vagas** | Responsável: Gestor | Tipo: Texto longo -> *docs/inputs/0-discovery/*
- [ ] **4. Definição dos campos da planilha de vagas** | Responsável: Dev | Tipo: Checkbox
- [ ] **5. Mapeamento do processo de raspagem e publicação (AS-IS/TO-BE)** | Responsável: Dev | Tipo: Checkbox
- [ ] **6. Definição de permissões e regras de acesso do portal** | Responsável: Dev | Tipo: Checkbox
- [ ] **7. Validar acesso técnico a sistemas / chaves de API necessárias** | Responsável: Dev | Tipo: Texto longo -> *Verificar docs/inputs/3-credenciais/*

### Fase 1 — Proposta & Alinhamento
- [ ] **1. Definir escopo detalhado: o que faz e o que NÃO faz** | Responsável: Gestor | Tipo: Checkbox
- [ ] **2. Estimar horas com buffer de 20%** | Responsável: Dev | Tipo: Checkbox
- [ ] **3. Contrato de prestação de serviço assinado** | Responsável: Comercial | Tipo: Upload -> *Verificar docs/inputs/1-proposta/*
- [ ] **4. NDA assinado (quando aplicável)** | Responsável: Comercial | Tipo: Upload -> *Verificar docs/inputs/1-proposta/*

### Fase 2 — Design (PDD & UI/UX)
- [ ] **1. Fluxo de dados detalhado (PDD) para a automação** | Responsável: Dev | Tipo: Upload -> *docs/inputs/2-design_pdd/*
- [ ] **2. Wireframe / Layout do Portal de Vagas (Figma)** | Responsável: Designer | Tipo: Link -> *docs/inputs/2-design_pdd/*
- [ ] **3. Identidade visual e estilos globais (design system)** | Responsável: Designer | Tipo: Checkbox
- [ ] **4. Modelagem do Banco de Dados (ERD)** | Responsável: Dev | Tipo: Upload -> *docs/inputs/2-design_pdd/*
- [ ] **5. Estrutura e schema da Planilha (Google Sheets/Excel)** | Responsável: Dev | Tipo: Checkbox
- [ ] **6. PDD e Telas aprovadas pelo cliente** | Responsável: Gestor | Tipo: Upload

### Fase 3 — Desenvolvimento (Automação & Portal)
- [ ] **1. Setup inicial do Portal de Vagas (Framework / Local)** | Responsável: Dev | Tipo: Link
- [ ] **2. Modelagem e criação do Banco de Dados local** | Responsável: Dev | Tipo: Checkbox
- [ ] **3. Desenvolvimento do Crawler / Automatizador (Scraper de vagas)** | Responsável: Dev | Tipo: Checkbox
- [ ] **4. Integração do Crawler com a Planilha (Salvar vagas)** | Responsável: Dev | Tipo: Checkbox
- [ ] **5. Interface do Portal de Vagas (Listagem, Filtros, Detalhes)** | Responsável: Dev | Tipo: Checkbox
- [ ] **6. Integração de Publicação Automática (Planilha -> Portal)** | Responsável: Dev | Tipo: Checkbox
- [ ] **7. Painel administrativo para moderação/aprovação de vagas (se necessário)** | Responsável: Dev | Tipo: Checkbox
- [ ] **8. Versionamento Git (Local/Branch)** | Responsável: Dev | Tipo: Link

### Fase 4 — Testes (UAT)
- [ ] **1. Testes unitários de raspagem dos sites específicos** | Responsável: Dev | Tipo: Checkbox
- [ ] **2. Testes de gravação na planilha e tratamento de duplicatas** | Responsável: Dev | Tipo: Checkbox
- [ ] **3. Teste do fluxo de publicação automática e integridade de dados** | Responsável: Dev | Tipo: Checkbox
- [ ] **4. Teste mobile/responsivo do portal** | Responsável: Dev | Tipo: Checkbox
- [ ] **5. Conduzir sessão de UAT com usuário-chave** | Responsável: Gestor | Tipo: Checkbox
- [ ] **6. Documentação de bugs encontrados e correções** | Responsável: Dev | Tipo: Texto longo
- [ ] **7. Termo de aceite assinado pelo cliente** | Responsável: Gestor | Tipo: Upload -> *docs/inputs/4-testes/*

### Fase 5 — Deploy & Handover (Somente sob demanda explícita)
- [ ] **1. Migração do portal e banco para ambiente produtivo** | Responsável: Dev | Tipo: Checkbox
- [ ] **2. Configuração de DNS e certificado SSL** | Responsável: Dev | Tipo: Checkbox
- [ ] **3. Configuração de agendamento (Cron / Scheduler do Crawler)** | Responsável: Dev | Tipo: Checkbox
- [ ] **4. Monitoramento ativo de falhas e logs** | Responsável: Dev | Tipo: Link
- [ ] **5. Manual de operação (POP) da automação e portal** | Responsável: Dev | Tipo: Upload
- [ ] **6. Onboarding/Treinamento do cliente** | Responsável: Gestor | Tipo: Checkbox
- [ ] **7. Definição do suporte e check-in de 30 dias** | Responsável: CS / Gestor | Tipo: Checkbox
