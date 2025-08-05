# Configuração da Integração com Google Sheets

## Passo 1: Criar a Planilha do Google Sheets

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Configure as colunas na primeira linha:
   - A1: Timestamp
   - B1: Email
   - C1: Experiência
   - D1: Comentário
   - E1: Data do Feedback

## Passo 2: Obter o ID da Planilha

1. Na URL da planilha, copie o ID (parte entre /d/ e /edit)
   - Exemplo: `https://docs.google.com/spreadsheets/d/1ABC123.../edit`
   - ID: `1ABC123...`

## Passo 3: Configurar Google Apps Script

1. Acesse [Google Apps Script](https://script.google.com)
2. Clique em "Novo projeto"
3. Substitua o código padrão pelo conteúdo do arquivo `google-apps-script.js`
4. **IMPORTANTE**: Substitua `'YOUR_SPREADSHEET_ID'` pelo ID da sua planilha
5. Salve o projeto com um nome (ex: "Feedback Collector")

## Passo 4: Implantar o Script

1. Clique em "Implantar" > "Nova implantação"
2. Escolha "Web app"
3. Configure:
   - **Executar como**: Você mesmo
   - **Quem tem acesso**: Qualquer pessoa
4. Clique em "Implantar"
5. **Copie a URL gerada** (algo como: `https://script.google.com/macros/s/AKfycbz.../exec`)

## Passo 5: Atualizar o Código Frontend

1. No arquivo `src/components/FeedbackBox.tsx`
2. Substitua `'YOUR_SCRIPT_ID'` pela URL do seu script
3. A URL deve ficar assim:
   ```javascript
   const response = await fetch('https://script.google.com/macros/s/AKfycbz.../exec', {
   ```

## Passo 6: Testar

1. Execute sua aplicação
2. Vá para a página de Sugestões
3. Preencha o feedback e envie
4. Verifique se os dados aparecem na planilha

## Estrutura dos Dados

A planilha receberá:
- **Timestamp**: Data/hora do envio
- **Email**: Email do usuário logado
- **Experiência**: "Triste", "Neutro" ou "Feliz"
- **Comentário**: Texto digitado pelo usuário
- **Data do Feedback**: Data ISO do feedback

## Solução de Problemas

### Erro CORS
- Verifique se o script está configurado como "Web app"
- Confirme que "Quem tem acesso" está como "Qualquer pessoa"

### Dados não aparecem na planilha
- Verifique se o ID da planilha está correto
- Confirme que você tem permissão de escrita na planilha
- Verifique os logs do Apps Script (Execuções > Ver execuções)

### Erro 403
- Verifique se a URL do script está correta
- Confirme que o script foi implantado corretamente 