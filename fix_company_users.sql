-- Script para corrigir dados: inserir usuários que estão em profiles mas não em company_users

-- 1. Verificar quais usuários estão em profiles mas não em company_users
SELECT 
    p.id as profile_id,
    p.name,
    p.email,
    p.company_id,
    CASE WHEN cu.id IS NULL THEN 'FALTANDO' ELSE 'OK' END as status_company_user
FROM profiles p
LEFT JOIN company_users cu ON p.id = cu.user_id
WHERE p.company_id IS NOT NULL
ORDER BY p.created_at DESC;

-- 2. Inserir usuários que estão faltando na tabela company_users
INSERT INTO company_users (user_id, company_id, role, position)
SELECT 
    p.id as user_id,
    p.company_id,
    CASE 
        WHEN p.is_company_owner = true THEN 'owner'
        ELSE 'employee'
    END as role,
    'Funcionário' as position
FROM profiles p
LEFT JOIN company_users cu ON p.id = cu.user_id
WHERE p.company_id IS NOT NULL 
    AND cu.id IS NULL;

-- 3. Verificar o resultado após a correção
SELECT 
    p.id as profile_id,
    p.name,
    p.email,
    p.company_id,
    cu.id as company_user_id,
    cu.role,
    cu.position,
    c.name as company_name
FROM profiles p
LEFT JOIN company_users cu ON p.id = cu.user_id
LEFT JOIN companies c ON p.company_id = c.id
WHERE p.company_id IS NOT NULL
ORDER BY p.created_at DESC; 