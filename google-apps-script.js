// Google Apps Script para receber feedback e salvar no Google Sheets
// IMPORTANTE: Substitua 'YOUR_SPREADSHEET_ID' pelo ID da sua planilha

function doPost(e) {
  // Configurar CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  try {
    console.log('Recebendo requisição POST');
    console.log('Dados recebidos:', e.postData.contents);
    
    // Obter os dados enviados
    const data = JSON.parse(e.postData.contents);
    
    // Abrir a planilha (substitua pelo ID da sua planilha)
    const spreadsheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
    const sheet = spreadsheet.getActiveSheet();
    
    // Preparar os dados para inserção
    const rowData = [
      new Date(), // Timestamp
      data.email || 'N/A', // Email do usuário
      data.experiencia || 'N/A', // Experiência (Triste/Neutro/Feliz)
      data.comentario || 'N/A', // Comentário
      data.data || new Date().toISOString() // Data do feedback
    ];
    
    console.log('Dados para inserir:', rowData);
    
    // Inserir na próxima linha disponível
    sheet.appendRow(rowData);
    
    console.log('Dados inseridos com sucesso');
    
    // Retornar resposta de sucesso
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Feedback enviado com sucesso!',
        data: rowData
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    console.error('Erro no script:', error.toString());
    
    // Retornar erro
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString(),
        message: 'Erro ao processar feedback'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

// Função para configurar CORS (necessária para requisições do frontend)
function doGet(e) {
  return ContentService
    .createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Função para configurar cabeçalhos CORS
function doOptions(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
} 