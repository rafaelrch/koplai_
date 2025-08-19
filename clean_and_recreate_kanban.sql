-- Script para limpar e recriar as tabelas do Kanban corretamente
-- Execute este script no SQL Editor do Supabase

-- ⚠️ ATENÇÃO: Este script vai apagar todos os dados existentes!
-- Execute apenas se quiser começar do zero

-- 1. Limpar dados existentes
DELETE FROM kanban_tasks;
DELETE FROM kanban_columns;

-- 2. Verificar se as tabelas estão vazias
SELECT 'Verificando se as tabelas estão vazias:' as info;
SELECT 'kanban_columns' as table_name, COUNT(*) as count FROM kanban_columns
UNION ALL
SELECT 'kanban_tasks' as table_name, COUNT(*) as count FROM kanban_tasks;

-- 3. Verificar se o campo view_type existe
SELECT 'Verificando estrutura da tabela kanban_columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'kanban_columns' 
ORDER BY ordinal_position;

-- 4. Inserir colunas para "Tarefas do dia"
INSERT INTO kanban_columns (title, color, position, view_type) VALUES
  ('A Fazer', '#3B82F6', 0, 'daily'),
  ('Produzindo', '#F59E0B', 1, 'daily'),
  ('Em aprovação', '#EC4899', 2, 'daily'),
  ('Com o cliente', '#10B981', 3, 'daily');

-- 5. Inserir colunas para "Aprovação interna"
INSERT INTO kanban_columns (title, color, position, view_type) VALUES
  ('Pendente', '#F59E0B', 0, 'approval'),
  ('Em revisão', '#8B5CF6', 1, 'approval'),
  ('Aprovado', '#10B981', 2, 'approval'),
  ('Reprovado', '#EF4444', 3, 'approval');

-- 6. Verificar colunas criadas
SELECT 'Colunas criadas:' as info;
SELECT 
  id,
  title,
  color,
  position,
  view_type,
  created_at
FROM kanban_columns 
ORDER BY view_type, position;

-- 7. Inserir tarefas de exemplo para "Tarefas do dia"
INSERT INTO kanban_tasks (title, description, column_id, position, view_type) VALUES
  ('CRIAR MVP', 'Desenvolver o MVP do projeto com funcionalidades básicas', 
   (SELECT id FROM kanban_columns WHERE title = 'A Fazer' AND view_type = 'daily' LIMIT 1), 0, 'daily'),
  ('Implementar autenticação', 'Adicionar sistema de login e registro', 
   (SELECT id FROM kanban_columns WHERE title = 'Produzindo' AND view_type = 'daily' LIMIT 1), 0, 'daily'),
  ('Testar funcionalidades', 'Realizar testes de todas as funcionalidades', 
   (SELECT id FROM kanban_columns WHERE title = 'Em aprovação' AND view_type = 'daily' LIMIT 1), 0, 'daily');

-- 8. Inserir tarefas de exemplo para "Aprovação interna"
INSERT INTO kanban_tasks (title, description, column_id, position, view_type) VALUES
  ('Revisar Design', 'Aprovar o design final do projeto', 
   (SELECT id FROM kanban_columns WHERE title = 'Pendente' AND view_type = 'approval' LIMIT 1), 0, 'approval'),
  ('Validar funcionalidades', 'Verificar se todas as funcionalidades estão corretas', 
   (SELECT id FROM kanban_columns WHERE title = 'Em revisão' AND view_type = 'approval' LIMIT 1), 0, 'approval'),
  ('Aprovar release', 'Liberar versão para produção', 
   (SELECT id FROM kanban_columns WHERE title = 'Aprovado' AND view_type = 'approval' LIMIT 1), 0, 'approval');

-- 9. Verificar tarefas criadas
SELECT 'Tarefas criadas:' as info;
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

-- 10. Resumo final
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

-- 11. Verificar relacionamentos
SELECT 'Verificando relacionamentos:' as info;
SELECT 
  c.title as column_name,
  c.view_type,
  COUNT(t.id) as task_count
FROM kanban_columns c
LEFT JOIN kanban_tasks t ON c.id = t.column_id
GROUP BY c.id, c.title, c.view_type
ORDER BY c.view_type, c.position;
