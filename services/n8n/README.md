# Automações JAB via n8n

Esta pasta armazena as especificações de workflows do n8n para a coleta, filtragem e limpeza automática das vagas de Jovem Aprendiz.

## Workflows Disponíveis

### 1. Workflow de Raspagem (`n8n_scraper_workflow.json`)
* **Gatilho**: Agendado (Cron: a cada 6 ou 12 horas).
* **Leitura de Fontes**: Lê a planilha Google Sheets de `fontes_busca`.
* **Loop de Raspagem**: Visita cada URL ativa, extrai dados de vaga usando nós HTTP Request e nós de código (JS) ou Parser HTML.
* **Filtro**: Valida se a vaga é de Jovem Aprendiz.
* **Duplicidade**: Gera hash MD5 do link da vaga e compara com o banco/planilha existente.
* **Escrita**: Insere novas vagas com status `PENDENTE` na planilha de Triagem.

### 2. Workflow de Limpeza (`n8n_cleanup_workflow.json`)
* **Gatilho**: Agendado (Cron: diário às 00:00).
* **Processamento**: Varre a planilha de Triagem, calcula a idade das vagas a partir de `data_descoberta` e deleta ou marca como `EXPIRADO` qualquer vaga com mais de 90 dias de idade.
