-- Teste para verificar se o usuário atual consegue acessar os agentes
-- Execute este script no SQL Editor do Supabase

-- Verificar o usuário atual
SELECT auth.uid() as current_user_id;

-- Verificar se há políticas RLS na tabela agents
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'agents';

-- Testar acesso direto aos agentes
SELECT COUNT(*) as accessible_agents FROM agents;

-- Verificar se há algum problema com a estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'agents' 
ORDER BY ordinal_position; 