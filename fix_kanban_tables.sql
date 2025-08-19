-- Script para corrigir problemas nas tabelas do Kanban
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se as tabelas existem e sua estrutura atual
SELECT 'Estrutura atual da tabela kanban_columns:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'kanban_columns' 
ORDER BY ordinal_position;

SELECT 'Estrutura atual da tabela kanban_tasks:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'kanban_tasks' 
ORDER BY ordinal_position;

-- 2. Verificar se há dados duplicados ou inconsistentes
SELECT 'Verificando dados duplicados em kanban_columns:' as info;
SELECT title, COUNT(*) as count
FROM kanban_columns 
GROUP BY title 
HAVING COUNT(*) > 1;

SELECT 'Verificando dados duplicados em kanban_tasks:' as info;
SELECT title, COUNT(*) as count
FROM kanban_tasks 
GROUP BY title 
HAVING COUNT(*) > 1;

-- 3. Limpar dados duplicados (se existirem)
-- Descomente as linhas abaixo se encontrar duplicatas
-- DELETE FROM kanban_tasks WHERE id NOT IN (
--   SELECT MIN(id) FROM kanban_tasks GROUP BY title, column_id
-- );
-- DELETE FROM kanban_columns WHERE id NOT IN (
--   SELECT MIN(id) FROM kanban_columns GROUP BY title, view_type
-- );

-- 4. Verificar se o campo view_type existe e tem valores corretos
SELECT 'Verificando view_type em kanban_columns:' as info;
SELECT view_type, COUNT(*) as count
FROM kanban_columns 
GROUP BY view_type;

SELECT 'Verificando view_type em kanban_tasks:' as info;
SELECT view_type, COUNT(*) as count
FROM kanban_tasks 
GROUP BY view_type;

-- 5. Query melhorada para verificar os dados (sem duplicação de timestamps)
SELECT 'Dados das colunas (sem timestamps duplicados):' as info;
SELECT 
  id,
  title,
  color,
  position,
  view_type,
  created_at
FROM kanban_columns 
ORDER BY view_type, position;

SELECT 'Dados das tarefas (sem timestamps duplicados):' as info;
SELECT 
  t.id,
  t.title,
  t.description,
  c.title as column_name,
  t.position,
  t.view_type,
  t.created_at
FROM kanban_tasks t 
JOIN kanban_columns c ON t.column_id = c.id 
ORDER BY t.view_type, c.position, t.position;

-- 6. Verificar relacionamentos
SELECT 'Verificando relacionamentos:' as info;
SELECT 
  'Tarefas sem coluna válida:' as check_type,
  COUNT(*) as count
FROM kanban_tasks t
LEFT JOIN kanban_columns c ON t.column_id = c.id
WHERE c.id IS NULL

UNION ALL

SELECT 
  'Colunas sem tarefas:' as check_type,
  COUNT(*) as count
FROM kanban_columns c
LEFT JOIN kanban_tasks t ON c.id = t.column_id
WHERE t.id IS NULL;

-- 7. Resumo final
SELECT 'Resumo final:' as info;
SELECT 
  'kanban_columns' as table_name,
  COUNT(*) as total_rows,
  COUNT(DISTINCT view_type) as view_types
FROM kanban_columns

UNION ALL

SELECT 
  'kanban_tasks' as table_name,
  COUNT(*) as total_rows,
  COUNT(DISTINCT view_type) as view_types
FROM kanban_tasks;
