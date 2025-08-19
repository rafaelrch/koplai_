-- Script para testar a persistência do drag and drop
-- Execute este script no SQL Editor do Supabase para monitorar as mudanças

-- 1. Verificar tarefas antes do teste
SELECT 'Estado inicial das tarefas:' as info;
SELECT 
  t.id,
  t.title,
  c.title as column_name,
  t.position,
  t.view_type,
  t.updated_at
FROM kanban_tasks t 
JOIN kanban_columns c ON t.column_id = c.id 
ORDER BY t.view_type, c.position, t.position;

-- 2. Função para monitorar mudanças em tempo real
-- Execute esta query repetidamente para ver as mudanças
SELECT 
  'Monitoramento de mudanças:' as info,
  NOW() as timestamp;

SELECT 
  t.id,
  t.title,
  c.title as column_name,
  t.position,
  t.view_type,
  t.updated_at,
  EXTRACT(EPOCH FROM (NOW() - t.updated_at)) as seconds_since_update
FROM kanban_tasks t 
JOIN kanban_columns c ON t.column_id = c.id 
WHERE t.updated_at > NOW() - INTERVAL '1 minute'
ORDER BY t.updated_at DESC;

-- 3. Verificar se há tarefas órfãs (sem coluna válida)
SELECT 'Verificando tarefas órfãs:' as info;
SELECT 
  t.id,
  t.title,
  t.column_id,
  'ÓRFÃ - coluna não existe' as status
FROM kanban_tasks t
LEFT JOIN kanban_columns c ON t.column_id = c.id
WHERE c.id IS NULL;

-- 4. Verificar inconsistências de view_type
SELECT 'Verificando inconsistências de view_type:' as info;
SELECT 
  t.id,
  t.title,
  t.view_type as task_view_type,
  c.view_type as column_view_type,
  'INCONSISTENTE' as status
FROM kanban_tasks t
JOIN kanban_columns c ON t.column_id = c.id
WHERE t.view_type != c.view_type;

-- 5. Histórico de atualizações recentes
SELECT 'Últimas 10 atualizações:' as info;
SELECT 
  t.id,
  t.title,
  c.title as column_name,
  t.updated_at,
  t.view_type
FROM kanban_tasks t 
JOIN kanban_columns c ON t.column_id = c.id 
ORDER BY t.updated_at DESC 
LIMIT 10;

