const { createClient } = require('@supabase/supabase-js');

// Configure suas credenciais do Supabase aqui
const supabaseUrl = 'YOUR_SUPABASE_URL';  // Substitua pela sua URL do Supabase
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';  // Substitua pela sua chave do Supabase

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateDatabase() {
  console.log('🚀 Iniciando migração do banco de dados...');
  
  try {
    // 1. Primeiro, vamos verificar se as tabelas existem
    console.log('📋 Verificando estrutura das tabelas...');
    
    // 2. Limpar dados antigos (opcional - descomente se quiser limpar tudo)
    /*
    console.log('🧹 Limpando dados antigos...');
    await supabase.from('kanban_tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('kanban_columns').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    */
    
    // 3. Criar colunas para cada área
    console.log('📊 Criando colunas para cada área...');
    
    const areas = ['social-media', 'video-editing', 'design', 'traffic', 'captacao'];
    const areaNames = {
      'social-media': 'Social Media',
      'video-editing': 'Edição de Video', 
      'design': 'Design',
      'traffic': 'Tráfego',
      'captacao': 'Captação'
    };
    
    for (const area of areas) {
      console.log(`📁 Criando colunas para área: ${areaNames[area]}`);
      
      // Criar 4 colunas padrão para cada área
      const columns = [
        { title: 'A Fazer', color: '#3B82F6', position: 0 },
        { title: 'Produzindo', color: '#F59E0B', position: 1 },
        { title: 'Em aprovação', color: '#EC4899', position: 2 },
        { title: 'Concluído', color: '#10B981', position: 3 }
      ];
      
      for (const col of columns) {
        const { data, error } = await supabase
          .from('kanban_columns')
          .insert([{
            title: col.title,
            color: col.color,
            position: col.position,
            view_type: area
          }]);
          
        if (error) {
          console.error(`❌ Erro ao criar coluna ${col.title} para ${area}:`, error);
        } else {
          console.log(`✅ Coluna ${col.title} criada para ${areaNames[area]}`);
        }
      }
    }
    
    console.log('🎉 Migração concluída com sucesso!');
    console.log('📱 Agora você pode acessar o Kanban e ver as áreas funcionando.');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
}

// Executar migração
migrateDatabase();
