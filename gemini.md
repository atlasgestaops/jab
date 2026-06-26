# Constituição do Produto — JAB (Portal de Vagas e Automação de Jovem Aprendiz)

## 🏗️ Invariantes Arquiteturais
- **Serviços (Automação)**: 
  - **n8n**: Workflows agendados para ler a planilha de fontes, raspar as vagas de Jovem Aprendiz, filtrar dados, verificar duplicidade e salvar na Planilha de Triagem.
  - Um cron job adicional no n8n para expirar e remover vagas com mais de 90 dias (3 meses).
- **Dados (Planilha & Local DB)**: 
  - **Google Sheets**: Planilha de Fontes (URLs a rastrear) + Planilha de Triagem (Banco de vagas pendentes e validadas).
  - **SQLite Local (ou JSON cache)**: Sincronização offline rápida para alimentar o frontend do Portal.
- **Produto (Portal & Painel)**: 
  - **Vite + React (TypeScript)** com CSS Vanilla premium.
  - Interface otimizada e responsiva integrada com blocos/espaços reservados e responsivos para anúncios do **Google AdSense** (sidebar, interstitial cards, headers).
- **Arquitetura**: 3 camadas P.D.S. (Produto, Dados, Serviços).

## 👥 Permissões e Regras de Acesso
- **Candidato (Público)**: Visualização livre de vagas `VALIDADAS` / `PUBLICADAS`, com filtros por palavra-chave e localidade.
- **Administrador (Moderador)**: Acesso ao painel administrativo local para:
  - Visualizar vagas `PENDENTES`.
  - Clicar no link para abrir a vaga original.
  - Aprovar (status ➔ `VALIDADO`) ou rejeitar (status ➔ `REJEITADO`).

## 📊 Modelo de Dados (Database Schema)

### Planilha 1: `fontes_busca`
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INT | ID incremental da fonte. |
| `url` | TEXT | URL do portal ou página de vagas a ser raspada. |
| `nome_fonte` | TEXT | Nome descritivo (ex: "Gupy Nestlé", "Vagas.com"). |
| `ativa` | BOOLEAN | Define se o n8n deve monitorar essa fonte no momento. |

### Planilha 2 / Tabela `vagas`
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | TEXT (PK) | Hash MD5 ou similar gerado a partir da URL da vaga para evitar duplicidade. |
| `titulo` | TEXT | Cargo da vaga. |
| `empresa` | TEXT | Empresa anunciante. |
| `localidade` | TEXT | Cidade/UF ou "Remoto". |
| `descricao` | TEXT | Requisitos, benefícios e detalhes da vaga. |
| `url` | TEXT | Link direto da vaga para abertura e moderação. |
| `origem` | TEXT | Nome da fonte de onde foi coletada. |
| `status` | TEXT | `PENDENTE`, `VALIDADO`, `REJEITADO`, `PUBLICADO`. |
| `data_publicacao` | DATE | Data em que a vaga foi originalmente publicada (se disponível). |
| `data_fechamento` | DATE | Data de validade/fechamento da vaga (se disponível). |
| `data_descoberta` | TIMESTAMP | Data e hora em que a vaga foi coletada pela automação. |
| `data_validacao` | TIMESTAMP | Data e hora em que foi validada pelo administrador. |

## 🧠 Regras de Negócio Críticas
1. **Foco Exclusivo (Regra Absoluta)**: O robô n8n só deve salvar vagas contendo o termo "jovem aprendiz" ou "aprendiz" no título ou descrição.
2. **Prevenção de Duplicatas (Regra Absoluta)**: A inserção de vagas na planilha/banco exige validação do `id` (hash da URL) para evitar repetição.
3. **Expiração Automática**: Um workflow/cron no n8n rodará diariamente para deletar ou marcar como `EXPIRADO` qualquer vaga cuja `data_descoberta` seja superior a 90 dias (3 meses).
4. **Ciclo de Triagem Manual**:
   - Raspagem ➔ Status `PENDENTE`.
   - Moderação Manual (Clique e validação) ➔ Status `VALIDADO`.
   - Portal consome apenas vagas `VALIDADAS` (com status atualizado para `PUBLICADO` ao exibir online).
