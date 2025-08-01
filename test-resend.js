// Teste simples do Resend API
const testResend = async () => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_DSQ8goww_8kyX35vESDtJaEgvYqbBsJVF',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'test@example.com',
        subject: 'Teste Resend',
        html: '<h1>Teste</h1><p>Este é um teste do Resend API</p>'
      })
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response:', data);
    
  } catch (error) {
    console.error('Erro:', error);
  }
};

// Executar teste
testResend(); 