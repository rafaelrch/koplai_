-- Script para inserir agentes de teste
-- Execute este script no SQL Editor do Supabase

-- Primeiro, vamos ver a estrutura da tabela agents
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'agents';

-- Inserir agentes de exemplo (com sintaxe correta de arrays)
INSERT INTO agents (name, description, tags, created_at) VALUES
('Agente Instagram', 'Especialista em marketing para Instagram', ARRAY['Instagram', 'Marketing'], NOW()),
('Agente Youtube', 'Criador de conteúdo para Youtube', ARRAY['Youtube', 'Marketing'], NOW()),
('Agente Copywriting', 'Especialista em copywriting persuasivo', ARRAY['Copywriting', 'Marketing'], NOW()),
('Agente Cliente', 'Atendimento ao cliente automatizado', ARRAY['Cliente', 'Suporte'], NOW());

-- Verificar se os agentes foram inseridos
SELECT * FROM agents; 