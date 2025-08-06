-- Teste simples para verificar se conseguimos acessar os agentes
-- Execute este script no SQL Editor do Supabase

-- Verificar quantos agentes existem
SELECT COUNT(*) as total_agents FROM agents;

-- Ver os primeiros 5 agentes
SELECT id, name, description, tags, created_at 
FROM agents 
ORDER BY created_at DESC 
LIMIT 5;

-- Verificar se há algum problema com as tags
SELECT id, name, tags, 
       CASE 
         WHEN tags IS NULL THEN 'NULL'
         WHEN array_length(tags, 1) IS NULL THEN 'Empty Array'
         ELSE 'Has Tags'
       END as tags_status
FROM agents 
LIMIT 3; 