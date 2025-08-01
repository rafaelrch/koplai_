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
    console.log('Recebido invitation_id:', invitation_id)

    // Criar cliente Supabase com chave anon (mesma do frontend)
    const supabaseClient = createClient(
      'https://oaxjdnvwwwkmcgcmsvhv.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heGpkbnZ3d3drbWNnY21zdmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTY1OTAsImV4cCI6MjA2NjU3MjU5MH0.vTI-LaYD59BoloFaLBt_OTr7mh5659TaaDwuPUqa7PQ' // Sua chave anon
    )

    // Buscar detalhes do convite
    const { data: invitation, error: invitationError } = await supabaseClient
      .from('invitations')
      .select('*')
      .eq('id', invitation_id)
      .single()

    if (invitationError || !invitation) {
      console.error('Erro ao buscar convite:', invitationError?.message || 'Convite não encontrado')
      return new Response(JSON.stringify({ error: 'Convite não encontrado' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }
    console.log('Convite encontrado:', invitation)

    // Buscar detalhes da empresa separadamente
    const { data: company, error: companyError } = await supabaseClient
      .from('companies')
      .select('name, email')
      .eq('id', invitation.company_id)
      .single();

    if (companyError || !company) {
      console.error('Erro ao buscar empresa:', companyError?.message || 'Empresa não encontrada');
      return new Response(JSON.stringify({ error: 'Empresa não encontrada' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }
    console.log('Empresa encontrada:', company)

    // Buscar detalhes do perfil do remetente separadamente
    const { data: inviterProfile, error: inviterProfileError } = await supabaseClient
      .from('profiles')
      .select('name, email')
      .eq('id', invitation.created_by)
      .single();

    if (inviterProfileError || !inviterProfile) {
      console.error('Erro ao buscar perfil do remetente:', inviterProfileError?.message || 'Perfil do remetente não encontrado');
      return new Response(JSON.stringify({ error: 'Perfil do remetente não encontrado' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }
    console.log('Perfil do remetente encontrado:', inviterProfile)

    const SITE_URL = Deno.env.get('SITE_URL') || 'http://localhost:8080' // Usar variável de ambiente ou fallback
    const inviteLink = `${SITE_URL}/accept-invite?token=${invitation.token}`

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .header { background-color: #f4f4f4; padding: 10px; text-align: center; border-bottom: 1px solid #ddd; }
          .button { display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
          .footer { margin-top: 20px; font-size: 0.8em; color: #777; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Convite para ${company.name}</h2>
          </div>
          <p>Olá,</p>
          <p>Você foi convidado(a) por ${inviterProfile.name || inviterProfile.email} para se juntar à equipe de **${company.name}**.</p>
          <p>Para aceitar o convite e criar sua conta, clique no botão abaixo:</p>
          <p style="text-align: center;">
            <a href="${inviteLink}" class="button">Aceitar Convite</a>
          </p>
          <p>Se o botão não funcionar, copie e cole o seguinte link no seu navegador:</p>
          <p><a href="${inviteLink}">${inviteLink}</a></p>
          <p>Atenciosamente,<br>A equipe Koplai</p>
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `
    console.log('Enviando email para:', invitation.email)

    // Enviar email usando Resend
    const emailPayload = {
      from: 'noreply@koplai.com.br', // Usar domínio verificado
      to: invitation.email, // Enviar para o email real do convite
      subject: `Convite para ${company.name}`,
      html: emailHtml
    };

    console.log('Payload do email:', emailPayload)

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer re_DSQ8goww_8kyX35vESDtJaEgvYqbBsJVF`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    console.log('Resposta do Resend - Status:', emailResponse.status)
    console.log('Resposta do Resend - Headers:', Object.fromEntries(emailResponse.headers.entries()))

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Erro ao enviar email:', errorData);
      throw new Error('Falha ao enviar email');
    }

    console.log('Email enviado com sucesso via Resend');

    // Atualizar status do convite para 'sent'
    const { error: updateError } = await supabaseClient
      .from('invitations')
      .update({ status: 'sent' })
      .eq('id', invitation_id);

    if (updateError) {
      console.error('Erro ao atualizar status do convite:', updateError);
    }

    return new Response(JSON.stringify({ message: 'Email de convite enviado com sucesso!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Erro na Edge Function:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}) 