-- ================================================
-- RESET COMPLETO DO BANCO DE DADOS KANBAN
-- ================================================

-- 1. Verificar dados existentes (apenas para informação)
SELECT 'Colunas existentes:' as info;
SELECT view_type, COUNT(*) as total FROM kanban_columns GROUP BY view_type;

SELECT 'Tarefas existentes:' as info;
SELECT view_type, COUNT(*) as total FROM kanban_tasks GROUP BY view_type;

-- 2. Limpar TODOS os dados existentes
DELETE FROM kanban_tasks;
DELETE FROM kanban_columns;

-- 3. Remover constraints antigas
ALTER TABLE kanban_columns DROP CONSTRAINT IF EXISTS kanban_columns_view_type_check;
ALTER TABLE kanban_tasks DROP CONSTRAINT IF EXISTS kanban_tasks_view_type_check;

-- 4. Criar novas constraints para as áreas
ALTER TABLE kanban_columns 
ADD CONSTRAINT kanban_columns_view_type_check 
CHECK (view_type IN ('social-media', 'video-editing', 'design', 'traffic', 'captacao'));

ALTER TABLE kanban_tasks 
ADD CONSTRAINT kanban_tasks_view_type_check 
CHECK (view_type IN ('social-media', 'video-editing', 'design', 'traffic', 'captacao'));

-- 5. Inserir colunas para TODAS as áreas
INSERT INTO kanban_columns (title, color, position, view_type) VALUES 

-- SOCIAL MEDIA
('A Fazer', '#3B82F6', 0, 'social-media'),
('Produzindo', '#F59E0B', 1, 'social-media'),
('Em aprovação', '#EC4899', 2, 'social-media'),
('Concluído', '#10B981', 3, 'social-media'),

-- EDIÇÃO DE VIDEO
('A Fazer', '#3B82F6', 0, 'video-editing'),
('Produzindo', '#F59E0B', 1, 'video-editing'),
('Em aprovação', '#EC4899', 2, 'video-editing'),
('Concluído', '#10B981', 3, 'video-editing'),

-- DESIGN
('A Fazer', '#3B82F6', 0, 'design'),
('Produzindo', '#F59E0B', 1, 'design'),
('Em aprovação', '#EC4899', 2, 'design'),
('Concluído', '#10B981', 3, 'design'),

-- TRÁFEGO
('A Fazer', '#3B82F6', 0, 'traffic'),
('Produzindo', '#F59E0B', 1, 'traffic'),
('Em aprovação', '#EC4899', 2, 'traffic'),
('Concluído', '#10B981', 3, 'traffic'),

-- CAPTAÇÃO
('A Fazer', '#3B82F6', 0, 'captacao'),
('Produzindo', '#F59E0B', 1, 'captacao'),
('Em aprovação', '#EC4899', 2, 'captacao'),
('Concluído', '#10B981', 3, 'captacao');

-- 6. Verificar resultado final
SELECT 'RESULTADO FINAL:' as status;
SELECT view_type, title, COUNT(*) as quantidade 
FROM kanban_columns 
GROUP BY view_type, title 
ORDER BY view_type, position;

SELECT 'Total por área:' as resumo;
SELECT view_type, COUNT(*) as total_colunas 
FROM kanban_columns 
GROUP BY view_type 
ORDER BY view_type;
