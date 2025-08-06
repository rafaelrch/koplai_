# 🧪 Teste Final - Feedback para Google Sheets

## Como Testar

### 1. Teste Manual da URL
Primeiro, teste se o Google Apps Script está funcionando:

1. **Copie esta URL** e cole no navegador:
   ```
   https://script.google.com/macros/s/AKfycbw4xLMHa3evIEanuagbJx1TBQP8A2KJtN9SlHydyxpwe-6oTqNalEhviM2NzQ64ffmE/exec?email=teste@teste.com&experiencia=Feliz&comentario=Teste manual&data=2025-08-06T07:43:07.875Z
   ```

2. **Você deve ver** uma página com JSON:
   ```json
   {"success": true, "message": "Feedback enviado com sucesso!", "data": [...]}
   ```

3. **Verifique a planilha** - deve aparecer uma nova linha com os dados

### 2. Teste na Aplicação

1. **Execute sua aplicação**
2. **Vá para `/sugestoes`**
3. **Preencha o feedback**:
   - Selecione um rosto
   - Digite um comentário
   - Clique em "Enviar"

4. **Observe**:
   - Uma nova aba deve abrir brevemente (1-2 segundos)
   - A aba deve fechar automaticamente
   - Deve aparecer "Obrigado pelo feedback!"

### 3. Verificar Resultados

1. **Abra sua planilha** do Google Sheets
2. **Verifique se apareceu** uma nova linha com:
   - Timestamp (data/hora atual)
   - Email do usuário
   - Experiência selecionada
   - Comentário digitado
   - Data do feedback

## O que Deve Acontecer

### ✅ Se Funcionar:
- Nova aba abre e fecha rapidamente
- Mensagem "Obrigado pelo feedback!" aparece
- Dados aparecem na planilha do Google Sheets
- Console mostra "Feedback enviado via nova janela"

### ❌ Se Não Funcionar:
- Nova aba não abre
- Erro no console
- Dados não aparecem na planilha

## Solução de Problemas

### Se a nova aba não abrir:
- Verifique se o bloqueador de pop-ups está ativo
- Desative temporariamente o bloqueador de pop-ups

### Se os dados não aparecem na planilha:
- Verifique se o ID da planilha está correto no Google Apps Script
- Confirme se a planilha tem as colunas corretas
- Verifique os logs do Google Apps Script

### Se houver erro no console:
- Compartilhe o erro para análise

## Próximos Passos

1. **Teste a URL manualmente** primeiro
2. **Teste na aplicação**
3. **Verifique a planilha**
4. **Me informe o resultado**

Se funcionar, você terá uma integração completa e funcional! 🎉 