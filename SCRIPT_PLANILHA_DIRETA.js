// Script para receber feedback e salvar na planilha atual
// Este script deve ser executado diretamente na planilha via Extensões > Apps Script

function doGet(e) {
  try {
    console.log('=== RECEBENDO FEEDBACK ===');
    console.log('Parâmetros recebidos:', e.parameter);
    
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
      
      // Obter a planilha ativa (a planilha onde o script está)
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      console.log('Planilha ativa obtida:', spreadsheet.getName());
      
      const sheet = spreadsheet.getActiveSheet();
      console.log('Sheet ativo obtido:', sheet.getName());
      
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
          planilha: spreadsheet.getName(),
          sheet: sheet.getName()
        }))
        .setMimeType(ContentService.MimeType.JSON);
        
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
    console.error('Erro no doGet:', error.toString());
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

// Função para testar localmente
function testarLocalmente() {
  console.log('=== TESTE LOCAL ===');
  
  // Simular dados de teste
  const dadosTeste = {
    email: 'teste@teste.com',
    experiencia: 'Feliz',
    comentario: 'Teste local',
    data: new Date().toISOString()
  };
  
  // Obter a planilha ativa
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  console.log('Planilha:', spreadsheet.getName());
  
  const sheet = spreadsheet.getActiveSheet();
  console.log('Sheet:', sheet.getName());
  
  // Preparar dados
  const rowData = [
    new Date(),
    dadosTeste.email,
    dadosTeste.experiencia,
    dadosTeste.comentario,
    dadosTeste.data
  ];
  
  console.log('Inserindo dados:', rowData);
  
  // Inserir dados
  sheet.appendRow(rowData);
  
  console.log('Teste concluído com sucesso!');
} 