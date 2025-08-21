import { supabase } from '../lib/supabaseClient';

export async function migrateToNewAreas() {
  console.log('🚀 Iniciando migração para o novo sistema de áreas...');
  
  try {
    // 1. Primeiro, vamos tentar remover as constraints antigas via SQL
    console.log('🔧 Removendo constraints antigas...');
    
    try {
      // Remover constraints antigas
      await supabase.rpc('execute_sql', {
        sql: `
          ALTER TABLE kanban_columns DROP CONSTRAINT IF EXISTS kanban_columns_view_type_check;
          ALTER TABLE kanban_tasks DROP CONSTRAINT IF EXISTS kanban_tasks_view_type_check;
          
          ALTER TABLE kanban_columns 
          ADD CONSTRAINT kanban_columns_view_type_check 
          CHECK (view_type IN ('social-media', 'video-editing', 'design', 'traffic', 'captacao'));
          
          ALTER TABLE kanban_tasks 
          ADD CONSTRAINT kanban_tasks_view_type_check 
          CHECK (view_type IN ('social-media', 'video-editing', 'design', 'traffic', 'captacao'));
        `
      });
      console.log('✅ Constraints atualizadas com sucesso');
    } catch (constraintError) {
      console.log('⚠️ Não foi possível atualizar constraints via RPC, continuando...');
    }

    // 2. Verificar se já existem colunas com as novas áreas
    const { data: existingColumns } = await supabase
      .from('kanban_columns')
      .select('view_type')
      .in('view_type', ['social-media', 'video-editing', 'design', 'traffic', 'captacao']);
    
    if (existingColumns && existingColumns.length > 0) {
      console.log('✅ Áreas já existem no banco de dados');
      return { success: true, message: 'Áreas já configuradas' };
    }
    
    // 2. Criar colunas para cada área
    const areas = [
      { id: 'social-media', name: 'Social Media' },
      { id: 'video-editing', name: 'Edição de Video' },
      { id: 'design', name: 'Design' },
      { id: 'traffic', name: 'Tráfego' },
      { id: 'captacao', name: 'Captação' }
    ];
    
    const defaultColumns = [
      { title: 'A Fazer', color: '#3B82F6', position: 0 },
      { title: 'Produzindo', color: '#F59E0B', position: 1 },
      { title: 'Em aprovação', color: '#EC4899', position: 2 },
      { title: 'Concluído', color: '#10B981', position: 3 }
    ];
    
    let totalCreated = 0;
    
    for (const area of areas) {
      console.log(`📁 Criando colunas para ${area.name}...`);
      
      for (const col of defaultColumns) {
        const { error } = await supabase
          .from('kanban_columns')
          .insert([{
            title: col.title,
            color: col.color,
            position: col.position,
            view_type: area.id
          }]);
          
        if (error) {
          console.error(`❌ Erro ao criar coluna ${col.title} para ${area.name}:`, error);
          throw error;
        } else {
          totalCreated++;
          console.log(`✅ Coluna ${col.title} criada para ${area.name}`);
        }
      }
    }
    
    console.log(`🎉 Migração concluída! ${totalCreated} colunas criadas.`);
    return { 
      success: true, 
      message: `Migração concluída com sucesso! ${totalCreated} colunas criadas.` 
    };
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    return { 
      success: false, 
      message: `Erro durante a migração: ${error.message}` 
    };
  }
}

// Função para limpar dados antigos (use com cuidado!)
export async function clearOldData() {
  console.log('🧹 Limpando dados antigos...');
  
  try {
    // Deletar tarefas antigas
    await supabase
      .from('kanban_tasks')
      .delete()
      .in('view_type', ['daily', 'approval']);
    
    // Deletar colunas antigas
    await supabase
      .from('kanban_columns')
      .delete()
      .in('view_type', ['daily', 'approval']);
    
    console.log('✅ Dados antigos removidos');
    return { success: true, message: 'Dados antigos removidos com sucesso' };
    
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
    return { success: false, message: `Erro ao limpar dados: ${error.message}` };
  }
}
