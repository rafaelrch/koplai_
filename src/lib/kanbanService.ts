import { supabase } from './supabaseClient';

// Tipos
export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  position: number;
  view_type: 'daily' | 'approval';
  created_at: string;
  updated_at: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  column_id: string;
  position: number;
  view_type: 'daily' | 'approval';
  links: any[];
  arquivos: any[];
  created_at: string;
  updated_at: string;
}

// Serviço para Colunas
export const columnService = {
  // Buscar todas as colunas
  async getAll(): Promise<KanbanColumn[]> {
    const { data, error } = await supabase
      .from('kanban_columns')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Erro ao buscar colunas:', error);
      throw error;
    }

    return data || [];
  },

  // Buscar colunas por tipo de visualização
  async getByViewType(viewType: 'daily' | 'approval'): Promise<KanbanColumn[]> {
    const { data, error } = await supabase
      .from('kanban_columns')
      .select('*')
      .eq('view_type', viewType)
      .order('position', { ascending: true });

    if (error) {
      console.error('Erro ao buscar colunas por view_type:', error);
      throw error;
    }

    return data || [];
  },

  // Criar nova coluna
  async create(column: Omit<KanbanColumn, 'id' | 'created_at' | 'updated_at'>): Promise<KanbanColumn> {
    const { data, error } = await supabase
      .from('kanban_columns')
      .insert([column])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar coluna:', error);
      throw error;
    }

    return data;
  },

  // Atualizar coluna
  async update(id: string, updates: Partial<KanbanColumn>): Promise<KanbanColumn> {
    const { data, error } = await supabase
      .from('kanban_columns')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar coluna:', error);
      throw error;
    }

    return data;
  },

  // Deletar coluna
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('kanban_columns')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar coluna:', error);
      throw error;
    }
  },

  // Atualizar posições das colunas
  async updatePositions(columns: { id: string; position: number }[]): Promise<void> {
    const updates = columns.map(col => ({
      id: col.id,
      position: col.position,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('kanban_columns')
      .upsert(updates);

    if (error) {
      console.error('Erro ao atualizar posições das colunas:', error);
      throw error;
    }
  }
};

// Serviço para Tarefas
export const taskService = {
  // Buscar todas as tarefas
  async getAll(): Promise<KanbanTask[]> {
    const { data, error } = await supabase
      .from('kanban_tasks')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Erro ao buscar tarefas:', error);
      throw error;
    }

    // Processar campos JSON se necessário
    const processedData = (data || []).map(task => ({
      ...task,
      links: typeof task.links === 'string' ? JSON.parse(task.links) : (task.links || []),
      arquivos: typeof task.arquivos === 'string' ? JSON.parse(task.arquivos) : (task.arquivos || [])
    }));

    return processedData;
  },

  // Buscar tarefas por tipo de visualização
  async getByViewType(viewType: 'daily' | 'approval'): Promise<KanbanTask[]> {
    const { data, error } = await supabase
      .from('kanban_tasks')
      .select('*')
      .eq('view_type', viewType)
      .order('position', { ascending: true });

    if (error) {
      console.error('Erro ao buscar tarefas por view_type:', error);
      throw error;
    }

    // Processar campos JSON se necessário
    const processedData = (data || []).map(task => ({
      ...task,
      links: typeof task.links === 'string' ? JSON.parse(task.links) : (task.links || []),
      arquivos: typeof task.arquivos === 'string' ? JSON.parse(task.arquivos) : (task.arquivos || [])
    }));

    return processedData;
  },

  // Buscar tarefas por coluna
  async getByColumn(columnId: string): Promise<KanbanTask[]> {
    const { data, error } = await supabase
      .from('kanban_tasks')
      .select('*')
      .eq('column_id', columnId)
      .order('position', { ascending: true });

    if (error) {
      console.error('Erro ao buscar tarefas da coluna:', error);
      throw error;
    }

    // Processar campos JSON se necessário
    const processedData = (data || []).map(task => ({
      ...task,
      links: typeof task.links === 'string' ? JSON.parse(task.links) : (task.links || []),
      arquivos: typeof task.arquivos === 'string' ? JSON.parse(task.arquivos) : (task.arquivos || [])
    }));

    return processedData;
  },

  // Criar nova tarefa
  async create(task: Omit<KanbanTask, 'id' | 'created_at' | 'updated_at'>): Promise<KanbanTask> {
    console.log('Tentando criar tarefa com dados:', task);
    
    // Garantir que os campos JSON estejam corretamente formatados
    const taskData = {
      title: task.title,
      description: task.description,
      column_id: task.column_id,
      position: task.position,
      view_type: task.view_type,
      links: task.links ? JSON.stringify(task.links) : '[]',
      arquivos: task.arquivos ? JSON.stringify(task.arquivos) : '[]'
    };

    console.log('Dados formatados para Supabase:', taskData);
    
    const { data, error } = await supabase
      .from('kanban_tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) {
      console.error('Erro detalhado ao criar tarefa:', {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('Tarefa criada com sucesso:', data);
    
    // Converter de volta os campos JSON
    const processedData = {
      ...data,
      links: typeof data.links === 'string' ? JSON.parse(data.links) : (data.links || []),
      arquivos: typeof data.arquivos === 'string' ? JSON.parse(data.arquivos) : (data.arquivos || [])
    };
    
    return processedData;
  },

  // Atualizar tarefa
  async update(id: string, updates: Partial<KanbanTask>): Promise<KanbanTask> {
    const { data, error } = await supabase
      .from('kanban_tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }

    return data;
  },

  // Deletar tarefa
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('kanban_tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar tarefa:', error);
      throw error;
    }
  },

  // Mover tarefa para outra coluna
  async moveTask(taskId: string, newColumnId: string, newPosition: number): Promise<void> {
    const { error } = await supabase
      .from('kanban_tasks')
      .update({ 
        column_id: newColumnId, 
        position: newPosition,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    if (error) {
      console.error('Erro ao mover tarefa:', error);
      throw error;
    }
  },

  // Atualizar posições das tarefas
  async updatePositions(tasks: { id: string; position: number; column_id: string }[]): Promise<void> {
    const updates = tasks.map(task => ({
      id: task.id,
      position: task.position,
      column_id: task.column_id,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('kanban_tasks')
      .upsert(updates);

    if (error) {
      console.error('Erro ao atualizar posições das tarefas:', error);
      throw error;
    }
  }
};

// Serviço principal do Kanban
export const kanbanService = {
  // Carregar dados completos do Kanban
  async loadKanban(): Promise<{ columns: KanbanColumn[]; tasks: KanbanTask[] }> {
    try {
      const [columns, tasks] = await Promise.all([
        columnService.getAll(),
        taskService.getAll()
      ]);

      return { columns, tasks };
    } catch (error) {
      console.error('Erro ao carregar dados do Kanban:', error);
      throw error;
    }
  },

  // Carregar dados por tipo de visualização
  async loadKanbanByView(viewType: 'daily' | 'approval'): Promise<{ columns: KanbanColumn[]; tasks: KanbanTask[] }> {
    try {
      const [columns, tasks] = await Promise.all([
        columnService.getByViewType(viewType),
        taskService.getByViewType(viewType)
      ]);

      return { columns, tasks };
    } catch (error) {
      console.error('Erro ao carregar dados do Kanban por view:', error);
      throw error;
    }
  },

  // Inicializar dados padrão
  async initializeDefaultData(): Promise<void> {
    try {
      // Verificar se já existem colunas
      const existingColumns = await columnService.getAll();
      
      if (existingColumns.length === 0) {
        // Criar colunas para "Tarefas do dia"
        await columnService.create({ title: 'A Fazer', color: '#3B82F6', position: 0, view_type: 'daily' });
        await columnService.create({ title: 'Produzindo', color: '#F59E0B', position: 1, view_type: 'daily' });
        await columnService.create({ title: 'Em aprovação', color: '#EC4899', position: 2, view_type: 'daily' });
        await columnService.create({ title: 'Com o cliente', color: '#10B981', position: 3, view_type: 'daily' });

        // Criar colunas para "Aprovação interna"
        await columnService.create({ title: 'Pendente', color: '#F59E0B', position: 0, view_type: 'approval' });
        await columnService.create({ title: 'Em revisão', color: '#8B5CF6', position: 1, view_type: 'approval' });
        await columnService.create({ title: 'Aprovado', color: '#10B981', position: 2, view_type: 'approval' });
        await columnService.create({ title: 'Reprovado', color: '#EF4444', position: 3, view_type: 'approval' });
      }
    } catch (error) {
      console.error('Erro ao inicializar dados padrão:', error);
      throw error;
    }
  }
};
