-- ================================================
-- CORRIGIR CONSTRAINT DO BANCO DE DADOS
-- ================================================

-- 1. Primeiro, vamos verificar as constraints existentes
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name LIKE '%view_type%';

-- 2. Remover a constraint antiga que só aceita 'daily' e 'approval'
ALTER TABLE kanban_columns DROP CONSTRAINT IF EXISTS kanban_columns_view_type_check;
ALTER TABLE kanban_tasks DROP CONSTRAINT IF EXISTS kanban_tasks_view_type_check;

-- 3. Criar nova constraint que aceita as novas áreas
ALTER TABLE kanban_columns 
ADD CONSTRAINT kanban_columns_view_type_check 
CHECK (view_type IN ('social-media', 'video-editing', 'design', 'traffic', 'captacao'));

ALTER TABLE kanban_tasks 
ADD CONSTRAINT kanban_tasks_view_type_check 
CHECK (view_type IN ('social-media', 'video-editing', 'design', 'traffic', 'captacao'));

-- 4. Agora inserir as colunas para cada área
INSERT INTO kanban_columns (title, color, position, view_type) VALUES 
-- Social Media
('A Fazer', '#3B82F6', 0, 'social-media'),
('Produzindo', '#F59E0B', 1, 'social-media'),
('Em aprovação', '#EC4899', 2, 'social-media'),
('Concluído', '#10B981', 3, 'social-media'),

-- Edição de Video
('A Fazer', '#3B82F6', 0, 'video-editing'),
('Produzindo', '#F59E0B', 1, 'video-editing'),
('Em aprovação', '#EC4899', 2, 'video-editing'),
('Concluído', '#10B981', 3, 'video-editing'),

-- Design
('A Fazer', '#3B82F6', 0, 'design'),
('Produzindo', '#F59E0B', 1, 'design'),
('Em aprovação', '#EC4899', 2, 'design'),
('Concluído', '#10B981', 3, 'design'),

-- Tráfego
('A Fazer', '#3B82F6', 0, 'traffic'),
('Produzindo', '#F59E0B', 1, 'traffic'),
('Em aprovação', '#EC4899', 2, 'traffic'),
('Concluído', '#10B981', 3, 'traffic'),

-- Captação
('A Fazer', '#3B82F6', 0, 'captacao'),
('Produzindo', '#F59E0B', 1, 'captacao'),
('Em aprovação', '#EC4899', 2, 'captacao'),
('Concluído', '#10B981', 3, 'captacao');

-- 5. Verificar se tudo foi criado corretamente
SELECT view_type, title, COUNT(*) as total 
FROM kanban_columns 
GROUP BY view_type, title 
ORDER BY view_type, title;
