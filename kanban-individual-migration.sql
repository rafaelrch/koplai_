-- ================================================
-- MIGRAÇÃO PARA KANBAN INDIVIDUAL POR USUÁRIO
-- ================================================

-- 1. Adicionar coluna user_id nas tabelas
ALTER TABLE kanban_columns ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE kanban_tasks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Limpar dados existentes (opcional - descomente se quiser começar do zero)
-- DELETE FROM kanban_tasks;
-- DELETE FROM kanban_columns;

-- 3. Atualizar constraints para incluir user_id
ALTER TABLE kanban_columns DROP CONSTRAINT IF EXISTS kanban_columns_view_type_check;
ALTER TABLE kanban_tasks DROP CONSTRAINT IF EXISTS kanban_tasks_view_type_check;

ALTER TABLE kanban_columns 
ADD CONSTRAINT kanban_columns_view_type_check 
CHECK (view_type IN ('social-media', 'video-editing', 'design', 'traffic', 'captacao'));

ALTER TABLE kanban_tasks 
ADD CONSTRAINT kanban_tasks_view_type_check 
CHECK (view_type IN ('social-media', 'video-editing', 'design', 'traffic', 'captacao'));

-- 4. Verificar estrutura das tabelas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'kanban_columns' 
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'kanban_tasks' 
ORDER BY ordinal_position;
