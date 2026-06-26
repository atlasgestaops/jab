-- Criar tabela de vagas
CREATE TABLE IF NOT EXISTS vagas (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  empresa TEXT NOT NULL,
  localidade TEXT NOT NULL,
  descricao TEXT NOT NULL,
  url TEXT NOT NULL,
  origem TEXT NOT NULL,
  status TEXT DEFAULT 'PENDENTE',
  data_publicacao TEXT,
  data_descoberta TEXT NOT NULL,
  data_validacao TEXT,
  disparada INTEGER DEFAULT 0
);

-- Criar tabela de fontes de busca
CREATE TABLE IF NOT EXISTS fontes_busca (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  nome_fonte TEXT NOT NULL,
  ativa INTEGER DEFAULT 1
);

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL UNIQUE,
  cidade TEXT,
  data_cadastro TEXT NOT NULL
);

-- Criar tabela de disparos de WhatsApp (Logs)
CREATE TABLE IF NOT EXISTS disparos_whatsapp (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  vaga_id TEXT NOT NULL,
  status_envio TEXT NOT NULL,
  data_envio TEXT NOT NULL,
  FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY(vaga_id) REFERENCES vagas(id)
);

-- Inserir fontes de busca iniciais
INSERT OR IGNORE INTO fontes_busca (id, url, nome_fonte, ativa) VALUES 
(1, 'https://portal.gupy.io/job-nestle-aprendiz', 'Gupy Nestlé', 1),
(2, 'https://vagas.com/aprendiz-itau', 'Vagas Itaú', 1),
(3, 'https://ciee.org.br/vagas', 'CIEE', 1);

-- Inserir vagas de exemplo (mock)
INSERT OR IGNORE INTO vagas (id, titulo, empresa, localidade, descricao, url, origem, status, data_publicacao, data_descoberta, disparada) VALUES
('mock_1', 'Jovem Aprendiz - Área Administrativa', 'Nestlé Brasil', 'São Paulo/SP', 'Auxiliar nas rotinas administrativas, atendimento telefônico, organização de arquivos e controle de planilhas. Requisitos: Ensino médio completo ou em andamento, conhecimento básico do Pacote Office.', 'https://nestle.gupy.io/jobs/1', 'Gupy Nestlé', 'VALIDADO', '2026-06-20', '2026-06-20T10:00:00Z', 1),
('mock_2', 'Jovem Aprendiz em TI e Suporte', 'Itaú Unibanco', 'Remoto', 'Atuar no suporte técnico de primeiro nível a usuários, instalação de softwares e auxílio nas rotinas da equipe de infraestrutura de TI. Requisitos: Cursando Técnico ou Superior em TI, raciocínio lógico.', 'https://itau.vagas.com/jobs/2', 'Vagas Itaú', 'VALIDADO', '2026-06-22', '2026-06-22T14:30:00Z', 1),
('mock_3', 'Jovem Aprendiz Auxiliar de Vendas', 'C&A Modas', 'Belo Horizonte/MG', 'Atendimento ao cliente, organização do salão de vendas, reposição de mercadorias no estoque e cabines. Requisitos: Idade entre 14 e 22 anos, disponibilidade para trabalhar no turno da tarde.', 'https://ciee.org.br/vagas/3', 'CIEE', 'PENDENTE', '2026-06-23', '2026-06-23T09:15:00Z', 0);

-- Inserir usuários de teste para validar o disparo regional
INSERT OR IGNORE INTO usuarios (id, nome, whatsapp, cidade, data_cadastro) VALUES
('usr_1', 'João Silva', '5511999999999', 'São Paulo/SP', '2026-06-25T12:00:00Z'),
('usr_2', 'Maria Souza', '5531988888888', 'Belo Horizonte/MG', '2026-06-25T14:00:00Z'),
('usr_3', 'Pedro Santos', '5521977777777', 'Rio de Janeiro/RJ', '2026-06-25T15:00:00Z');
