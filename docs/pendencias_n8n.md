# Pendências e Melhorias dos Workflows (n8n)

Este documento registra o resultado da auditoria realizada com base nas regras de automação (Skills: n8n-workflow-patterns, n8n-node-configuration, etc). Estas pendências devem ser endereçadas no momento de finalização e deploy dos fluxos do n8n.

## 🚨 Crítico (Bloqueante para Execução)
- **Módulo nativo Node.js bloqueado:** O workflow `102` (Scraper) utiliza `require('crypto')` dentro de um nó Code para gerar o hash MD5 da vaga (que atua como ID único e previne duplicidade). 
  - **Ação:** Atualizar o `docker-compose.yml` e adicionar a variável de ambiente `NODE_FUNCTION_ALLOW_BUILTIN=crypto` (ou `*`) ao serviço do n8n. Caso contrário, o n8n vai gerar um erro fatal ao rodar esse nó por questões de segurança.

## ⚠️ Avisos de Boas Práticas (Melhorias Contínuas)

### 1. Scraper em Modo MOCK (Simulador)
- **Contexto:** Atualmente, o código do scraper no nó `Parser de Vagas e Filtro Relevância` (Workflow `102`) utiliza a condicional `if (pattern.test(html) || true)`. 
- **Problema:** Isso significa que a extração real não está acontecendo. Ele aprova o processamento independente do HTML recebido e cria uma vaga "fake" localizada em São Paulo/SP para permitir o andamento dos testes e a verificação visual no Frontend/Painel.
- **Ação:** Substituir o código de teste pela lógica real de extração (usando algo como Cheerio, ou regex aprimorado), coletando seletivamente `titulo`, `empresa`, `descricao`, etc. do HTML da fonte original.

### 2. Injeção de Dependências em SQL (Segurança)
- **Contexto:** Nos nós do Postgres (ex: em `101` para atualizar/inserir vagas), as operações estão configuradas como "Execute Query" passando strings brutas: `UPDATE vagas SET status = '{{ $json.body.status }}'`.
- **Problema:** Essa prática expõe a query a potenciais ataques de injeção de SQL (SQL Injection), pois o input vindo do JSON/Webhook não está sendo sanitizado através da biblioteca do banco de dados.
- **Ação:** Alterar o nó do Postgres para utilizar as operações nativas `Insert` ou `Update` nas configurações do n8n. O uso dos campos nativos garante que o n8n e o driver do Postgres realizarão o bind e o escape dos parâmetros, aumentando a segurança para produção.

### 3. Tratamento de Erros e Tolerância a Falhas (Error Handling)
- **Contexto:** Nenhum dos workflows (101 a 105) possui tratamento global ou isolado para lidar com falhas.
- **Problema:** Seguindo o padrão "Error Handler Pattern", fluxos de produção devem prever que serviços externos (ex: APIs e o Supabase) podem sair do ar ou sofrer timeouts. Sem tratamento, o workflow falha silenciosamente.
- **Ação:**
  - Configurar nós críticos (como HTTP Requests para sites terceiros no Scraper) com a opção **Continue On Fail** habilitada, gerindo o problema no nó seguinte usando `If`.
  - Como alternativa, criar um Workflow separado focado apenas em "Global Error Handling" (usando o `Error Trigger`) para enviar um alerta imediato (ex: por e-mail ou Telegram/WhatsApp) ao administrador caso algum nó do n8n falhe de forma imprevista.
