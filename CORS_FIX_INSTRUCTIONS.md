# 🔧 Correção do Erro CORS

## Problema Identificado
O erro CORS está impedindo o envio de dados do localhost para o Google Apps Script.

## Solução Implementada

### 1. Atualizar o Google Apps Script

1. **Acesse** [Google Apps Script](https://script.google.com)
2. **Abra** seu projeto existente
3. **Substitua** todo o código pelo conteúdo atualizado do arquivo `google-apps-script.js`
4. **IMPORTANTE**: Substitua `'YOUR_SPREADSHEET_ID'` pelo ID da sua planilha
5. **Salve** o projeto

### 2. Reimplantar o Script

1. **Clique** em "Implantar" > "Gerenciar implantações"
2. **Clique** no ícone de editar (lápis) da implantação existente
3. **Clique** em "Nova versão"
4. **Configure**:
   - **Executar como**: Você mesmo
   - **Quem tem acesso**: Qualquer pessoa
5. **Clique** em "Implantar"
6. **Copie** a nova URL (deve ser a mesma)

### 3. Testar a Correção

1. **Execute** sua aplicação
2. **Abra** o DevTools (F12)
3. **Vá** para a página de Sugestões
4. **Teste** o envio de feedback
5. **Verifique** o console para logs

## Mudanças Feitas

### Frontend (`FeedbackBox.tsx`)
- ✅ Mudou de POST para GET
- ✅ Usa parâmetros na URL em vez de JSON
- ✅ Adicionou `mode: 'no-cors'`
- ✅ Melhor tratamento de erros

### Google Apps Script
- ✅ Adicionou suporte a requisições GET
- ✅ Headers CORS em todas as funções
- ✅ Processamento de parâmetros via URL
- ✅ Logs detalhados para debug

## Estrutura da URL

A URL agora será algo como:
```
https://script.google.com/macros/s/AKfycbw4xLMHa3evIEanuagbJx1TBQP8A2KJtN9SlHydyxpwe-6oTqNalEhviM2NzQ64ffmE/exec?email=rafael.rocha@oktoagencia.com.br&experiencia=Neutro&comentario=Gostei&data=2025-08-06T07:33:09.400Z
```

## Verificação

Após a atualização, você deve ver no console:
```
Enviando dados: {email: "...", experiencia: "...", comentario: "...", data: "..."}
Status da resposta: 200
```

E os dados devem aparecer na sua planilha do Google Sheets.

## Se Ainda Houver Problemas

1. **Verifique** se o ID da planilha está correto
2. **Confirme** que a planilha tem as colunas corretas
3. **Teste** a URL do script diretamente no navegador
4. **Verifique** os logs do Google Apps Script 