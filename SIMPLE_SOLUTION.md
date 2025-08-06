# 🎯 Solução Simples para CORS

## Problema
O Google Apps Script tem restrições rigorosas de CORS que impedem requisições de localhost.

## Solução Mais Confiável

### Opção 1: Usar um Proxy CORS (Recomendado)

1. **Instale um proxy CORS local:**
   ```bash
   npm install -g cors-anywhere
   ```

2. **Execute o proxy:**
   ```bash
   cors-anywhere
   ```

3. **Modifique o código para usar o proxy:**
   ```javascript
   const response = await fetch(`http://localhost:8080/https://script.google.com/macros/s/AKfycbw4xLMHa3evIEanuagbJx1TBQP8A2KJtN9SlHydyxpwe-6oTqNalEhviM2NzQ64ffmE/exec?${params}`);
   ```

### Opção 2: Usar um Serviço de Proxy Online

Modifique o código para usar um proxy online:

```javascript
const response = await fetch(`https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbw4xLMHa3evIEanuagbJx1TBQP8A2KJtN9SlHydyxpwe-6oTqNalEhviM2NzQ64ffmE/exec?${params}`);
```

### Opção 3: Solução Temporária (Teste Manual)

1. **Teste a URL diretamente no navegador:**
   ```
   https://script.google.com/macros/s/AKfycbw4xLMHa3evIEanuagbJx1TBQP8A2KJtN9SlHydyxpwe-6oTqNalEhviM2NzQ64ffmE/exec?email=teste@teste.com&experiencia=Feliz&comentario=Teste&data=2025-08-06T07:39:40.279Z
   ```

2. **Se funcionar, os dados aparecerão na planilha**

### Opção 4: Solução Definitiva - Backend Próprio

Criar um endpoint no seu backend que faz a requisição para o Google Apps Script:

```javascript
// No seu backend (Node.js/Express)
app.post('/api/feedback', async (req, res) => {
  const { email, experiencia, comentario, data } = req.body;
  
  const params = new URLSearchParams({
    email, experiencia, comentario, data
  });
  
  const response = await fetch(`https://script.google.com/macros/s/AKfycbw4xLMHa3evIEanuagbJx1TBQP8A2KJtN9SlHydyxpwe-6oTqNalEhviM2NzQ64ffmE/exec?${params}`);
  
  res.json({ success: true });
});
```

## Recomendação Imediata

**Use a Opção 2** (proxy online) para testar rapidamente:

1. Modifique o `FeedbackBox.tsx` para usar o proxy
2. Teste o envio
3. Verifique se os dados aparecem na planilha

## Verificação

Após implementar qualquer solução:
1. Envie um feedback
2. Verifique a planilha do Google Sheets
3. Confirme se os dados foram inseridos

## Próximos Passos

1. **Teste a URL diretamente** no navegador primeiro
2. **Implemente uma das soluções** acima
3. **Verifique se funciona** na planilha
4. **Compartilhe o resultado** para ajustes finais 