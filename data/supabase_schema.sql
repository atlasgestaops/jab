-- Script de Criação de Tabelas no Supabase (PostgreSQL Editor)
-- Projeto: JAB (Portal de Vagas e Automação de Jovem Aprendiz)

-- 1. Tabela de Vagas
CREATE TABLE IF NOT EXISTS vagas (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  empresa TEXT NOT NULL,
  localidade TEXT NOT NULL,
  descricao TEXT NOT NULL,
  url TEXT NOT NULL,
  origem TEXT NOT NULL,
  status TEXT DEFAULT 'PENDENTE', -- PENDENTE, VALIDADO, REJEITADO
  data_publicacao TEXT,
  data_descoberta TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  data_validacao TIMESTAMP WITH TIME ZONE,
  disparada BOOLEAN DEFAULT false NOT NULL
);

-- 2. Tabela de Fontes de Busca
CREATE TABLE IF NOT EXISTS fontes_busca (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  url TEXT NOT NULL,
  nome_fonte TEXT NOT NULL,
  ativa BOOLEAN DEFAULT true NOT NULL
);

-- 3. Tabela de Usuários (Candidatos)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_confirmado BOOLEAN DEFAULT false NOT NULL,
  token_confirmacao TEXT UNIQUE NOT NULL,
  whatsapp TEXT UNIQUE,
  whatsapp_configurado BOOLEAN DEFAULT false NOT NULL,
  estado TEXT,
  cidade TEXT,
  categorias_vagas TEXT, -- Ex: "TI,Administrativo,Recepcao"
  frequencia_envio TEXT DEFAULT 'DIARIO' NOT NULL, -- REALTIME, DIARIO, SEMANAL
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Disparos de WhatsApp (Logs)
CREATE TABLE IF NOT EXISTS disparos_whatsapp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  vaga_id TEXT NOT NULL REFERENCES vagas(id) ON DELETE CASCADE,
  status_envio TEXT NOT NULL, -- SIMULADO_ENVIADO, FALHA, ENTREGUE
  data_envio TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de Controle de Sessão do Chatbot (WhatsApp Onboarding)
CREATE TABLE IF NOT EXISTS chat_sessions (
  usuario_id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  etapa_conversa TEXT NOT NULL, -- ESTADO_CIDADE, CATEGORIAS, FREQUENCIA, CONCLUIDO
  data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir dados mock de fontes
INSERT INTO fontes_busca (url, nome_fonte, ativa) VALUES 
('https://portal.gupy.io/job-nestle-aprendiz', 'Gupy Nestlé', true),
('https://vagas.com/aprendiz-itau', 'Vagas Itaú', true),
('https://ciee.org.br/vagas', 'CIEE', true)
ON CONFLICT DO NOTHING;
