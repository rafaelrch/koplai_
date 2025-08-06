// Google Apps Script para receber feedback e salvar no Google Sheets
// IMPORTANTE: Substitua 'YOUR_SPREADSHEET_ID' pelo ID da sua planilha

function doPost(e) {
  try {
    console.log('Recebendo requisição POST');
    console.log('Dados recebidos:', e.postData.contents);
    
    // Obter os dados enviados
    const data = JSON.parse(e.postData.contents);
    
    // Abrir a planilha (substitua pelo ID da sua planilha)
    const spreadsheet = SpreadsheetApp.openById('1A0y8ue3Ms0kLFvpy22iCMYCK8MKuRnHJ5XlJdY6JU8Q');
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
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Erro no script:', error.toString());
    
    // Retornar erro
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString(),
        message: 'Erro ao processar feedback'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função para configurar CORS (necessária para requisições do frontend)
function doGet(e) {
  try {
    console.log('Recebendo requisição GET');
    console.log('Parâmetros:', e.parameter);
    
    // Se há parâmetros, processar como feedback
    if (e.parameter.email) {
      const data = {
        email: e.parameter.email,
        experiencia: e.parameter.experiencia,
        comentario: e.parameter.comentario,
        data: e.parameter.data
      };
      
      console.log('Dados recebidos via GET:', data);
      
      // Abrir a planilha (substitua pelo ID da sua planilha)
      const spreadsheet = SpreadsheetApp.openById('1A0y8ue3Ms0kLFvpy22iCMYCK8MKuRnHJ5XlJdY6JU8Q');
      const sheet = spreadsheet.getActiveSheet();
      
      // Preparar os dados para inserção
      const rowData = [
        new Date(), // Timestamp
        data.email || 'N/A', // Email do usuário
        data.experiencia || 'N/A', // Experiência (Triste/Neutro/Feliz)
        data.comentario || 'N/A', // Comentário
        data.data || new Date().toISOString() // Data do feedback
      ];
      
      console.log('Dados para inserir via GET:', rowData);
      
      // Inserir na próxima linha disponível
      sheet.appendRow(rowData);
      
      console.log('Dados inseridos com sucesso via GET');
      
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          message: 'Feedback enviado com sucesso!',
          data: rowData
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Se não há parâmetros, retornar OK
    console.log('Nenhum parâmetro recebido, retornando OK');
    return ContentService
      .createTextOutput('OK')
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    console.error('Erro no doGet:', error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString(),
        message: 'Erro ao processar feedback'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função para configurar cabeçalhos CORS
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
} 