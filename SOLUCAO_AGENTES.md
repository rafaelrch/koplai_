# Solução para Agentes Não Aparecendo

## Problema Identificado
Os agentes não estão aparecendo na interface porque:
1. A tabela `agents` está vazia (0 registros)
2. Há uma política RLS (Row Level Security) ativa que impede a inserção de dados via API pública

## Solução

### Opção 1: Executar Script SQL no Supabase (Recomendado)

1. Acesse o **Supabase Dashboard**
2. Vá para **SQL Editor**
3. Execute o seguinte script:

```sql
-- Desabilitar RLS temporariamente
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;

-- Inserir os agentes
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

-- Reabilitar RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Criar política que permite leitura pública
DROP POLICY IF EXISTS "Allow public read access" ON agents;
CREATE POLICY "Allow public read access" ON agents
  FOR SELECT USING (true);

-- Verificar se os agentes foram inseridos
SELECT COUNT(*) as total_agents FROM agents;
```

### Opção 2: Usar Chave de Serviço (Alternativa)

Se você tiver a chave de serviço do Supabase, pode modificar o `supabaseClient.ts`:

```typescript
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oaxjdnvwwwkmcgcmsvhv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heGpkbnZ3d3drbWNnY21zdmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTY1OTAsImV4cCI6MjA2NjU3MjU5MH0.vTI-LaYD59BoloFaLBt_OTr7mh5659TaaDwuPUqa7PQ';

// Para inserção de dados, use a chave de serviço
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export { supabaseAdmin };
```

## Verificação

Após executar o script SQL, você pode verificar se funcionou:

1. No Supabase Dashboard, vá para **Table Editor**
2. Selecione a tabela `agents`
3. Deve mostrar 10 agentes inseridos

## Próximos Passos

1. Execute o script SQL no Supabase
2. Recarregue a página da aplicação
3. Os agentes devem aparecer na interface

## Notas Importantes

- A política RLS foi configurada para permitir leitura pública dos agentes
- Os agentes são dados estáticos que não precisam de autenticação para serem lidos
- Se precisar modificar os agentes no futuro, use o SQL Editor do Supabase 