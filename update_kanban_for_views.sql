-- Script para atualizar o Kanban para suportar duas visualizações
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar campo 'view_type' na tabela kanban_columns
ALTER TABLE kanban_columns 
ADD COLUMN IF NOT EXISTS view_type TEXT DEFAULT 'daily' CHECK (view_type IN ('daily', 'approval'));

-- 2. Adicionar campo 'view_type' na tabela kanban_tasks
ALTER TABLE kanban_tasks 
ADD COLUMN IF NOT EXISTS view_type TEXT DEFAULT 'daily' CHECK (view_type IN ('daily', 'approval'));

-- 3. Criar índices para melhor performance com view_type
CREATE INDEX IF NOT EXISTS idx_kanban_columns_view_type ON kanban_columns(view_type);
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_view_type ON kanban_tasks(view_type);

-- 4. Limpar dados existentes (opcional - descomente se quiser começar do zero)
-- DELETE FROM kanban_tasks;
-- DELETE FROM kanban_columns;

-- 5. Inserir colunas para "Tarefas do dia"
INSERT INTO kanban_columns (title, color, position, view_type) VALUES
  ('A Fazer', '#3B82F6', 0, 'daily'),
  ('Produzindo', '#F59E0B', 1, 'daily'),
  ('Em aprovação', '#EC4899', 2, 'daily'),
  ('Com o cliente', '#10B981', 3, 'daily')
ON CONFLICT DO NOTHING;

-- 6. Inserir colunas para "Aprovação interna"
INSERT INTO kanban_columns (title, color, position, view_type) VALUES
  ('Pendente', '#F59E0B', 0, 'approval'),
  ('Em revisão', '#8B5CF6', 1, 'approval'),
  ('Aprovado', '#10B981', 2, 'approval'),
  ('Reprovado', '#EF4444', 3, 'approval')
ON CONFLICT DO NOTHING;

-- 7. Inserir algumas tarefas de exemplo para "Tarefas do dia"
INSERT INTO kanban_tasks (title, description, column_id, position, view_type) VALUES
  ('CRIAR MVP', 'Desenvolver o MVP do projeto com funcionalidades básicas', 
   (SELECT id FROM kanban_columns WHERE title = 'A Fazer' AND view_type = 'daily' LIMIT 1), 0, 'daily'),
  ('Implementar autenticação', 'Adicionar sistema de login e registro', 
   (SELECT id FROM kanban_columns WHERE title = 'Produzindo' AND view_type = 'daily' LIMIT 1), 0, 'daily')
ON CONFLICT DO NOTHING;

-- 8. Inserir algumas tarefas de exemplo para "Aprovação interna"
INSERT INTO kanban_tasks (title, description, column_id, position, view_type) VALUES
  ('Revisar Design', 'Aprovar o design final do projeto', 
   (SELECT id FROM kanban_columns WHERE title = 'Pendente' AND view_type = 'approval' LIMIT 1), 0, 'approval'),
  ('Validar funcionalidades', 'Verificar se todas as funcionalidades estão corretas', 
   (SELECT id FROM kanban_columns WHERE title = 'Em revisão' AND view_type = 'approval' LIMIT 1), 0, 'approval')
ON CONFLICT DO NOTHING;

-- 9. Atualizar políticas RLS para incluir view_type (opcional - para controle de acesso)
-- CREATE POLICY "Allow public read access to kanban_columns by view" ON kanban_columns
--   FOR SELECT USING (true);

-- CREATE POLICY "Allow public read access to kanban_tasks by view" ON kanban_tasks
--   FOR SELECT USING (true);

-- 10. Verificar se tudo foi criado corretamente (sem duplicação de timestamps)
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
