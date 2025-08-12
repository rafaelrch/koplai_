-- Script para verificar e configurar políticas RLS na tabela agents
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'agents';

-- 2. Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'agents';

-- 3. Desabilitar RLS temporariamente (se necessário)
-- ALTER TABLE agents DISABLE ROW LEVEL SECURITY;

-- 4. Ou criar uma política que permite acesso público para leitura
-- DROP POLICY IF EXISTS "Allow public read access" ON agents;
-- CREATE POLICY "Allow public read access" ON agents
--   FOR SELECT USING (true);

-- 5. Ou criar uma política que permite inserção para usuários autenticados
-- DROP POLICY IF EXISTS "Allow authenticated insert" ON agents;
-- CREATE POLICY "Allow authenticated insert" ON agents
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 6. Ou criar uma política que permite todas as operações para usuários autenticados
-- DROP POLICY IF EXISTS "Allow authenticated all" ON agents;
-- CREATE POLICY "Allow authenticated all" ON agents
--   FOR ALL USING (auth.role() = 'authenticated');

-- 7. Verificar se a tabela tem dados
SELECT COUNT(*) as total_agents FROM agents;

-- 8. Se não houver dados, inserir agentes de teste
INSERT INTO agents (name, description, tags, inputs) VALUES
('Planejador de Campanhas', 'Especialista em planejamento estratégico de campanhas de marketing digital', ARRAY['Marketing', 'Cliente'], '[{"label": "Objetivo da Campanha", "placeholder": "Ex: Aumentar vendas em 30%"}, {"label": "Público-alvo", "placeholder": "Ex: Mulheres 25-35 anos, interessadas em fitness"}, {"label": "Orçamento", "placeholder": "Ex: R$ 5.000"}]'),
('Ideador de videos YT', 'Criador de ideias inovadoras para conteúdo do YouTube', ARRAY['Youtube'], '[{"label": "Nicho do Canal", "placeholder": "Ex: Tecnologia, Gaming, Educação"}, {"label": "Duração Desejada", "placeholder": "Ex: 10-15 minutos"}, {"label": "Tópico Principal", "placeholder": "Ex: Como aprender programação"}]'),
('Posicionamento de Marca', 'Especialista em posicionamento e estratégia de marca', ARRAY['Marketing', 'Cliente'], '[{"label": "Nome da Marca", "placeholder": "Ex: TechCorp"}, {"label": "Setor de Atuação", "placeholder": "Ex: Tecnologia, Saúde, Educação"}, {"label": "Diferencial Competitivo", "placeholder": "Ex: Inovação, Qualidade, Preço"}]')
ON CONFLICT DO NOTHING;

-- 9. Verificar novamente
SELECT COUNT(*) as total_agents FROM agents; 