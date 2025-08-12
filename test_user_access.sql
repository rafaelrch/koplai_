-- Teste para verificar se o usuário atual consegue acessar os agentes
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se RLS está habilitado na tabela agents
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'agents';

-- 2. Verificar se há políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'agents';

-- 3. Testar acesso direto (como o frontend faz)
SELECT * FROM agents LIMIT 3;

-- 4. Verificar se há algum filtro implícito
SELECT COUNT(*) as total_agents FROM agents; 