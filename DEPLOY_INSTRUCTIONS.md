# 🚀 Deploy da Edge Function - Sistema de Email

## 📋 Passos para Deploy Manual

### 1. Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto: `oaxjdnvwwwkmcgcmsvhv`

### 2. Vá para Edge Functions
- No menu lateral, clique em **"Edge Functions"**
- Clique em **"Create a new function"**

### 3. Configure a Function
- **Nome da função**: `send-invite-email`
- **Código**: Copie o conteúdo do arquivo `supabase/functions/send-invite-email/index.ts`

### 4. Deploy
- Clique em **"Deploy"**

## 🔧 Configuração da Edge Function

### Código da Function:
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { invitation_id } = await req.json()

    // Criar cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Buscar dados do convite
    const { data: invitation, error: inviteError } = await supabaseClient
      .from('invitations')
      .select(`
        *,
        companies(name, email),
        profiles!invitations_created_by_fkey(name, email)
      `)
      .eq('id', invitation_id)
      .single()

    if (inviteError || !invitation) {
      throw new Error('Convite não encontrado')
    }

    // Gerar link de convite
    const inviteLink = `${Deno.env.get('SITE_URL')}/accept-invite?token=${invitation.token}`

    // Template do email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Convite para ${invitation.companies.name}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Convite para ${invitation.companies.name}</h1>
          </div>
          <div class="content">
            <h2>Olá!</h2>
            <p>Você foi convidado por <strong>${invitation.profiles.name}</strong> para fazer parte da equipe da <strong>${invitation.companies.name}</strong> no Koplai.</p>
            
            <p><strong>Detalhes do convite:</strong></p>
            <ul>
              <li><strong>Cargo:</strong> ${invitation.role === 'employee' ? 'Funcionário' : invitation.role === 'manager' ? 'Gerente' : 'Administrador'}</li>
              <li><strong>Função:</strong> ${invitation.position || 'Não especificada'}</li>
            </ul>

            <p>Para aceitar o convite e criar sua conta, clique no botão abaixo:</p>
            
            <a href="${inviteLink}" class="button">Aceitar Convite</a>
            
            <p><small>Este link expira em 7 dias. Se não conseguir clicar no botão, copie e cole este link no seu navegador:</small></p>
            <p><small>${inviteLink}</small></p>
          </div>
          <div class="footer">
            <p>Este é um email automático do Koplai. Não responda a este email.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Enviar email usando Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer re_DSQ8goww_8kyX35vESDtJaEgvYqbBsJVF`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Koplai <noreply@koplai.com>',
        to: invitation.email,
        subject: `Convite para ${invitation.companies.name}`,
        html: emailHtml
      })
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Erro ao enviar email:', errorData);
      throw new Error('Falha ao enviar email');
    }

    // Atualizar status do convite
    await supabaseClient
      .from('invitations')
      .update({ status: 'sent' })
      .eq('id', invitation_id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email enviado com sucesso',
        inviteLink 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
```

## 🧪 Teste após o Deploy

1. **Acesse** `/invite-users` no seu app
2. **Preencha um convite** com um email válido
3. **Clique em "Enviar Convite"**
4. **Verifique** se o email chega na caixa de entrada

## 🔗 URL da Edge Function

Após o deploy, a função estará disponível em:
```
https://oaxjdnvwwwkmcgcmsvhv.supabase.co/functions/v1/send-invite-email
```

## ⚠️ Importante

- A chave do Resend já está configurada no código
- O template de email está pronto
- O sistema de convites já está integrado 