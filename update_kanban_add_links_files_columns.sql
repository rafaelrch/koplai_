-- Script para adicionar colunas separadas 'links' e 'arquivos' na tabela kanban_tasks
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar coluna 'links' para armazenar apenas links
ALTER TABLE kanban_tasks 
ADD COLUMN IF NOT EXISTS links JSONB DEFAULT '[]'::jsonb;

-- 2. Adicionar coluna 'arquivos' para armazenar apenas arquivos (imagens/vídeos)
ALTER TABLE kanban_tasks 
ADD COLUMN IF NOT EXISTS arquivos JSONB DEFAULT '[]'::jsonb;

-- 3. Migrar dados existentes da coluna 'attachments' para as novas colunas
UPDATE kanban_tasks 
SET 
  links = (
    SELECT COALESCE(jsonb_agg(attachment), '[]'::jsonb)
    FROM jsonb_array_elements(attachments) AS attachment
    WHERE attachment->>'type' = 'link'
  ),
  arquivos = (
    SELECT COALESCE(jsonb_agg(attachment), '[]'::jsonb)
    FROM jsonb_array_elements(attachments) AS attachment
    WHERE attachment->>'type' IN ('image', 'video')
  )
WHERE attachments IS NOT NULL AND attachments != '[]'::jsonb;

-- 4. Criar índices para melhor performance nas novas colunas
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_links ON kanban_tasks USING GIN (links);
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_arquivos ON kanban_tasks USING GIN (arquivos);

-- 5. Opcional: Remover a coluna 'attachments' antiga (descomente se desejar)
-- ALTER TABLE kanban_tasks DROP COLUMN IF EXISTS attachments;

-- 6. Verificar a migração dos dados
SELECT 
  id,
  title,
  links,
  arquivos,
  attachments
FROM kanban_tasks
WHERE (links != '[]'::jsonb OR arquivos != '[]'::jsonb OR attachments != '[]'::jsonb)
LIMIT 10;

-- 7. Estatísticas da migração
SELECT 
  COUNT(*) as total_tasks,
  COUNT(CASE WHEN links != '[]'::jsonb THEN 1 END) as tasks_with_links,
  COUNT(CASE WHEN arquivos != '[]'::jsonb THEN 1 END) as tasks_with_files,
  COUNT(CASE WHEN attachments != '[]'::jsonb THEN 1 END) as tasks_with_old_attachments
FROM kanban_tasks;
