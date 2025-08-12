-- Script para corrigir o acesso à tabela agents
-- Execute este script no SQL Editor do Supabase

-- 1. Desabilitar RLS temporariamente para permitir inserção de dados
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;

-- 2. Inserir os agentes
INSERT INTO agents (name, description, tags, inputs) VALUES
('Planejador de Campanhas', 'Especialista em planejamento estratégico de campanhas de marketing digital', ARRAY['Marketing', 'Cliente'], '[{"label": "Objetivo da Campanha", "placeholder": "Ex: Aumentar vendas em 30%"}, {"label": "Público-alvo", "placeholder": "Ex: Mulheres 25-35 anos, interessadas em fitness"}, {"label": "Orçamento", "placeholder": "Ex: R$ 5.000"}]'),
('Ideador de videos YT', 'Criador de ideias inovadoras para conteúdo do YouTube', ARRAY['Youtube'], '[{"label": "Nicho do Canal", "placeholder": "Ex: Tecnologia, Gaming, Educação"}, {"label": "Duração Desejada", "placeholder": "Ex: 10-15 minutos"}, {"label": "Tópico Principal", "placeholder": "Ex: Como aprender programação"}]'),
('Posicionamento de Marca', 'Especialista em posicionamento e estratégia de marca', ARRAY['Marketing', 'Cliente'], '[{"label": "Nome da Marca", "placeholder": "Ex: TechCorp"}, {"label": "Setor de Atuação", "placeholder": "Ex: Tecnologia, Saúde, Educação"}, {"label": "Diferencial Competitivo", "placeholder": "Ex: Inovação, Qualidade, Preço"}]'),
('Estratégia de conteúdo', 'Planejador de estratégias de conteúdo para redes sociais', ARRAY['Marketing'], '[{"label": "Plataforma Principal", "placeholder": "Ex: Instagram, LinkedIn, TikTok"}, {"label": "Frequência de Posts", "placeholder": "Ex: 3x por semana"}, {"label": "Tipo de Conteúdo", "placeholder": "Ex: Educativo, Entretenimento, Promocional"}]'),
('Titulos para Youtube', 'Especialista em criação de títulos atrativos para YouTube', ARRAY['Youtube'], '[{"label": "Tema do Vídeo", "placeholder": "Ex: Tutorial de programação"}, {"label": "Público-alvo", "placeholder": "Ex: Iniciantes em programação"}, {"label": "Palavras-chave", "placeholder": "Ex: python, tutorial, iniciante"}]'),
('Diagnóstico de Marketing', 'Analista especializado em diagnóstico de estratégias de marketing', ARRAY['Marketing', 'Cliente'], '[{"label": "Setor da Empresa", "placeholder": "Ex: E-commerce, SaaS, Varejo"}, {"label": "Problemas Identificados", "placeholder": "Ex: Baixa conversão, pouco tráfego"}, {"label": "Objetivos", "placeholder": "Ex: Aumentar vendas, melhorar ROI"}]'),
('Briefing Estratégico', 'Criador de briefings estratégicos para campanhas e projetos', ARRAY['Marketing'], '[{"label": "Tipo de Projeto", "placeholder": "Ex: Campanha digital, Rebranding"}, {"label": "Escopo", "placeholder": "Ex: Redes sociais, Website, Publicidade"}, {"label": "Timeline", "placeholder": "Ex: 3 meses, 6 meses"}]'),
('Social Media Manager', 'Gerente de redes sociais com estratégias completas', ARRAY['Marketing'], '[{"label": "Redes Sociais", "placeholder": "Ex: Instagram, Facebook, LinkedIn"}, {"label": "Objetivo Principal", "placeholder": "Ex: Engajamento, Vendas, Branding"}, {"label": "Tom de Voz", "placeholder": "Ex: Profissional, Casual, Humorístico"}]'),
('Jornada de vendas', 'Especialista em otimização de jornadas de vendas', ARRAY['Marketing', 'Cliente'], '[{"label": "Produto/Serviço", "placeholder": "Ex: Software SaaS, Consultoria"}, {"label": "Público-alvo", "placeholder": "Ex: Empresas B2B, Consumidores finais"}, {"label": "Canal Principal", "placeholder": "Ex: LinkedIn, Email, Telefone"}]'),
('Perfil Do Cliente IDEAL (ICP)', 'Definidor de perfis de clientes ideais para segmentação', ARRAY['Marketing', 'Cliente'], '[{"label": "Setor de Atuação", "placeholder": "Ex: Tecnologia, Saúde, Educação"}, {"label": "Tamanho da Empresa", "placeholder": "Ex: Startup, PME, Grande empresa"}, {"label": "Cargo do Decisor", "placeholder": "Ex: CEO, CTO, Gerente de Marketing"}]');

-- 3. Reabilitar RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- 4. Criar política que permite leitura pública
DROP POLICY IF EXISTS "Allow public read access" ON agents;
CREATE POLICY "Allow public read access" ON agents
  FOR SELECT USING (true);

-- 5. Verificar se os agentes foram inseridos
SELECT COUNT(*) as total_agents FROM agents;
SELECT name, tags FROM agents LIMIT 5; 