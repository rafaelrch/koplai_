# Troubleshooting - Erro no Envio de Feedback

## Problema Atual
Erro "Erro ao enviar feedback. Tente novamente." ao tentar enviar feedback.

## Passos para Diagnosticar

### 1. Verificar Console do Navegador
1. Abra o DevTools (F12)
2. Vá para a aba "Console"
3. Tente enviar o feedback novamente
4. Observe as mensagens de log que adicionamos

### 2. Verificar Google Apps Script
1. Acesse [Google Apps Script](https://script.google.com)
2. Abra seu projeto
3. Vá em "Execuções" no menu lateral
4. Verifique se há execuções recentes e seus logs

### 3. Problemas Comuns e Soluções

#### Problema: Script não está configurado como Web App
**Solução:**
1. No Google Apps Script, clique em "Implantar" > "Nova implantação"
2. Escolha "Web app"
3. Configure:
   - **Executar como**: Você mesmo
   - **Quem tem acesso**: Qualquer pessoa
4. Clique em "Implantar"
5. Copie a nova URL

#### Problema: ID da planilha incorreto
**Solução:**
1. Verifique se substituiu `'YOUR_SPREADSHEET_ID'` no script
2. O ID está na URL da planilha entre `/d/` e `/edit`
3. Exemplo: `https://docs.google.com/spreadsheets/d/1ABC123.../edit`
4. ID: `1ABC123...`

#### Problema: Permissões da planilha
**Solução:**
1. Abra a planilha do Google Sheets
2. Clique em "Compartilhar" (canto superior direito)
3. Adicione seu email com permissão de "Editor"
4. Ou torne a planilha pública (não recomendado para dados sensíveis)

#### Problema: CORS (Cross-Origin Resource Sharing)
**Solução:**
1. Verifique se o script tem as funções `doGet` e `doOptions`
2. Confirme que os headers CORS estão configurados
3. Tente acessar a URL do script diretamente no navegador

### 4. Teste Manual do Script

1. Acesse a URL do seu script diretamente:
   ```
   https://script.google.com/macros/s/AKfycbw4xLMHa3evIEanuagbJx1TBQP8A2KJtN9SlHydyxpwe-6oTqNalEhviM2NzQ64ffmE/exec
   ```

2. Você deve ver "OK" se o script estiver funcionando

### 5. Verificar Dados Enviados

No console do navegador, você deve ver:
```
Enviando dados: {
  email: "rafael.rocha@okt...",
  experiencia: "Feliz",
  comentario: "Adicionar mais agentes",
  data: "2024-01-XX..."
}
```

### 6. Status da Resposta

Verifique se o status da resposta é 200 (OK). Se for diferente, pode indicar:
- 403: Problema de permissões
- 404: URL incorreta
- 500: Erro no script

## Próximos Passos

1. **Execute o teste** e verifique o console
2. **Compartilhe os logs** do console se o erro persistir
3. **Verifique os logs** do Google Apps Script
4. **Confirme** se a planilha foi criada e tem as colunas corretas

## Estrutura Esperada da Planilha

A planilha deve ter estas colunas na primeira linha:
- A1: Timestamp
- B1: Email  
- C1: Experiência
- D1: Comentário
- E1: Data do Feedback 