// Script de teste para debug
function doGet(e) {
  try {
    console.log('=== TESTE DEBUG ===');
    console.log('Recebendo requisição GET');
    console.log('Parâmetros recebidos:', e.parameter);
    console.log('Email recebido:', e.parameter.email);
    console.log('Experiência recebida:', e.parameter.experiencia);
    console.log('Comentário recebido:', e.parameter.comentario);
    
    // Se há parâmetros, processar como feedback
    if (e.parameter.email) {
      console.log('Processando feedback...');
      
      const data = {
        email: e.parameter.email,
        experiencia: e.parameter.experiencia,
        comentario: e.parameter.comentario,
        data: e.parameter.data
      };
      
      console.log('Dados processados:', data);
      
      // Tentar abrir a planilha
      try {
        const spreadsheet = SpreadsheetApp.openById('1A0y8ue3Ms0kLFvpy22iCMYCK8MKuRnHJ5XlJdY6JU8Q');
        console.log('Planilha aberta com sucesso');
        
        const sheet = spreadsheet.getActiveSheet();
        console.log('Sheet ativo obtido');
        
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
        
        console.log('Dados inseridos com sucesso!');
        
        return ContentService
          .createTextOutput(JSON.stringify({ 
            success: true, 
            message: 'Feedback enviado com sucesso!',
            data: rowData,
            debug: 'Dados inseridos na planilha'
          }))
          .setMimeType(ContentService.MimeType.JSON);
          
      } catch (spreadsheetError) {
        console.error('Erro ao acessar planilha:', spreadsheetError.toString());
        return ContentService
          .createTextOutput(JSON.stringify({ 
            success: false, 
            error: 'Erro ao acessar planilha: ' + spreadsheetError.toString(),
            debug: 'Falha ao abrir planilha'
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    } else {
      console.log('Nenhum parâmetro email encontrado');
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'Nenhum parâmetro email encontrado',
          debug: 'Parâmetros recebidos: ' + JSON.stringify(e.parameter)
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    console.error('Erro geral no doGet:', error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString(),
        debug: 'Erro geral no script'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  return doGet(e);
}

function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
} 