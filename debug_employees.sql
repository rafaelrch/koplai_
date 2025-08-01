-- Script para debugar dados dos funcionários

-- 1. Verificar se existem empresas
SELECT * FROM companies;

-- 2. Verificar se existem usuários na tabela company_users
SELECT * FROM company_users;

-- 3. Verificar se existem perfis
SELECT * FROM profiles;

-- 4. Verificar a relação entre as tabelas
SELECT 
    cu.id as company_user_id,
    cu.company_id,
    cu.user_id,
    cu.role,
    cu.position,
    cu.created_at,
    p.name,
    p.email,
    c.name as company_name
FROM company_users cu
LEFT JOIN profiles p ON cu.user_id = p.id
LEFT JOIN companies c ON cu.company_id = c.id
ORDER BY cu.created_at DESC;

-- 5. Verificar se há usuários sem perfil
SELECT 
    cu.*,
    CASE WHEN p.id IS NULL THEN 'SEM PERFIL' ELSE 'COM PERFIL' END as status_perfil
FROM company_users cu
LEFT JOIN profiles p ON cu.user_id = p.id; 