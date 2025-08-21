-- ================================================
-- MIGRAÇÃO PARA NOVO SISTEMA DE ÁREAS DO KANBAN
-- ================================================

-- 1. Primeiro, vamos limpar os dados antigos (OPCIONAL - descomente se quiser limpar)
-- DELETE FROM kanban_tasks;
-- DELETE FROM kanban_columns;

-- 2. Criar colunas para Social Media
INSERT INTO kanban_columns (title, color, position, view_type) VALUES 
('A Fazer', '#3B82F6', 0, 'social-media'),
('Produzindo', '#F59E0B', 1, 'social-media'),
('Em aprovação', '#EC4899', 2, 'social-media'),
('Concluído', '#10B981', 3, 'social-media');

-- 3. Criar colunas para Edição de Video
INSERT INTO kanban_columns (title, color, position, view_type) VALUES 
('A Fazer', '#3B82F6', 0, 'video-editing'),
('Produzindo', '#F59E0B', 1, 'video-editing'),
('Em aprovação', '#EC4899', 2, 'video-editing'),
('Concluído', '#10B981', 3, 'video-editing');

-- 4. Criar colunas para Design
INSERT INTO kanban_columns (title, color, position, view_type) VALUES 
('A Fazer', '#3B82F6', 0, 'design'),
('Produzindo', '#F59E0B', 1, 'design'),
('Em aprovação', '#EC4899', 2, 'design'),
('Concluído', '#10B981', 3, 'design');

-- 5. Criar colunas para Tráfego
INSERT INTO kanban_columns (title, color, position, view_type) VALUES 
('A Fazer', '#3B82F6', 0, 'traffic'),
('Produzindo', '#F59E0B', 1, 'traffic'),
('Em aprovação', '#EC4899', 2, 'traffic'),
('Concluído', '#10B981', 3, 'traffic');

-- 6. Criar colunas para Captação
INSERT INTO kanban_columns (title, color, position, view_type) VALUES 
('A Fazer', '#3B82F6', 0, 'captacao'),
('Produzindo', '#F59E0B', 1, 'captacao'),
('Em aprovação', '#EC4899', 2, 'captacao'),
('Concluído', '#10B981', 3, 'captacao');

-- 7. Verificar se as colunas foram criadas corretamente
SELECT view_type, COUNT(*) as total_colunas 
FROM kanban_columns 
GROUP BY view_type 
ORDER BY view_type;
