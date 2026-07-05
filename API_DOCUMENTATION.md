# 📖 Documentação Técnica da API Backend e Banco de Dados — JAB

Esta documentação detalha a arquitetura de dados e de serviços do **Portal de Vagas e Automação de Jovem Aprendiz (JAB)**.

---

## 📊 1. Modelo de Dados (Supabase / PostgreSQL)

O banco de dados é hospedado no Supabase. Toda a comunicação do robô de automação (n8n) e do frontend é feita de forma unificada e transacional por meio das tabelas listadas abaixo.

### 1.1. Tabela `fontes_busca`
Armazena a lista de sites e portais Gupy das empresas parceiras a serem mapeados e varridos pelo robô do n8n diariamente.

| Campo | Tipo | Chave | Descrição |
| :--- | :--- | :---: | :--- |
| `id` | SERIAL | PK | ID incremental gerado automaticamente. |
| `url` | TEXT | - | Link completo do portal Gupy (ex: `https://assai.gupy.io/`). |
| `nome_fonte` | TEXT | - | Nome amigável/descritivo da empresa (ex: `Assaí Atacadista`). |
| `ativa` | BOOLEAN | - | Se `true`, o robô executa a varredura nessa fonte. Default: `true`. |

### 1.2. Tabela `vagas`
Armazena todas as vagas de Jovem Aprendiz coletadas automaticamente pelo robô ou cadastradas manualmente pelos recrutadores.

| Campo | Tipo | Chave | Descrição |
| :--- | :--- | :---: | :--- |
| `id` | TEXT | PK | ID único da vaga (Hash MD5 do link da vaga para evitar duplicidade). |
| `titulo` | TEXT | - | Título/Cargo da vaga (ex: "Jovem Aprendiz Logística"). |
| `empresa` | TEXT | - | Nome da empresa que oferece a vaga. |
| `localidade` | TEXT | - | Cidade - Estado ou "Remoto". |
| `descricao` | TEXT | - | Conteúdo completo com requisitos, benefícios e informações. |
| `url` | TEXT | - | Link direto para candidatura na vaga de origem. |
| `origem` | TEXT | - | Indica como a vaga entrou no sistema (ex: "Gupy", "Parceiro"). |
| `status` | TEXT | - | Ciclo de triagem: `PENDENTE`, `VALIDADO`, `REJEITADO`, `PUBLICADO`. |
| `data_publicacao` | TIMESTAMP | - | Data original de publicação (se disponível). |
| `data_descoberta` | TIMESTAMP | - | Data e hora em que a vaga foi coletada pela primeira vez. |
| `data_validacao` | TIMESTAMP | - | Data e hora em que o administrador validou a vaga no painel. |
| `empresa_id` | TEXT | FK | Referência para a empresa que publicou a vaga (opcional). |

---

## 🔌 2. Endpoints do API Backend (`q5BgsWzklLhb3XJg`)

O fluxo de API do n8n está no ar em [https://jab-api.atlasbot.tech](https://jab-api.atlasbot.tech) e gerencia todos os webhooks com resposta síncrona do banco de dados (`responseMode = lastNode`).

### 2.1. Candidato & Portal Público

#### `GET /webhook/vagas`
*   **Descrição:** Retorna a listagem de todas as vagas ativas no portal.
*   **Retorno:** Array de vagas filtradas no Supabase com `status != 'REJEITADO'`.

#### `POST /webhook/usuarios/cadastro`
*   **Descrição:** Registra a intenção do candidato de criar alertas de vagas.
*   **Payload:**
    ```json
    { "nome": "João Silva", "email": "joao@email.com" }
    ```
*   **Retorno:** Status de existência e token de confirmação gerado.

#### `POST /webhook/usuarios/confirmar`
*   **Descrição:** Ativa a inscrição do candidato a partir do link no e-mail.
*   **Payload:**
    ```json
    { "token": "tok_xyz789" }
    ```
*   **Retorno:** Confirmação do cadastro e dados básicos ativados.

#### `GET /webhook/usuarios/preferencias`
*   **Descrição:** Busca as cidades, estados e frequência de alertas configurados pelo candidato.
*   **Query Params:** `?id=[candidato_uuid]`
*   **Retorno:** Objeto de preferências de alertas de vagas.

---

### 2.2. Recrutador (Empresas)

#### `POST /webhook/empresas/cadastro`
*   **Descrição:** Cria uma conta de recrutador parceiro para postagem manual de vagas.
*   **Payload:**
    ```json
    { "cnpj": "00.000.000/0001-00", "nome_fantasia": "Tech S/A", "email": "contato@tech.com", "telefone": "(11) 99999-9999" }
    ```
*   **Retorno:** Empresa criada e token de acesso gerado.

#### `POST /webhook/empresas/login`
*   **Descrição:** Autentica a empresa recrutadora.
*   **Payload:**
    ```json
    { "email": "contato@tech.com" }
    ```
*   **Retorno:** Dados cadastrais da empresa e token de acesso.

#### `POST /webhook/vagas/cadastrar`
*   **Descrição:** Cria uma vaga manual cadastrada pelo recrutador. A vaga nasce com status `PENDENTE`.
*   **Payload:**
    ```json
    { "titulo": "Aprendiz Administrativo", "empresa": "Tech S/A", "localidade": "São Paulo - SP", "descricao": "...", "url": "https://tech.com/vaga", "empresa_id": "..." }
    ```
*   **Retorno:** ID da vaga criada e confirmação de sucesso.

#### `GET /webhook/empresas/vagas`
*   **Descrição:** Busca todas as vagas postadas especificamente pela empresa logada.
*   **Query Params:** `?empresa_id=[empresa_uuid]`
*   **Retorno:** Array com o histórico de vagas da empresa parceira.

---

### 2.3. Administração

#### `POST /webhook/vagas/moderacao`
*   **Descrição:** Aprova ou rejeita uma vaga pendente de triagem.
*   **Payload:**
    ```json
    { "id": "hash_vaga_md5", "status": "VALIDADO" } // ou "REJEITADO"
    ```
*   **Retorno:** Sucesso da operação.

#### `GET /webhook/fontes`
*   **Descrição:** Busca a lista de empresas e URLs Gupy varridas diariamente pelo robô.
*   **Retorno:** Lista de fontes cadastradas.

#### `POST /webhook/fontes/cadastrar`
*   **Descrição:** Insere um novo portal Gupy para monitoramento diário.
*   **Payload:**
    ```json
    { "nome_fonte": "Cacau Show", "url": "https://cacaushow.gupy.io/" }
    ```
*   **Retorno:** Fonte adicionada com sucesso.

#### `POST /webhook/fontes/deletar`
*   **Descrição:** Remove um portal da varredura de vagas.
*   **Payload:**
    ```json
    { "id": 12 }
    ```
*   **Retorno:** Fonte excluída com sucesso.
