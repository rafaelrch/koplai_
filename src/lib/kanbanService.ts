import { supabase } from './supabaseClient';

// Tipos
export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  column_id: string;
  position: number;
  attachments: any[];
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

    return data || [];
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

    return data || [];
  },

  // Criar nova tarefa
  async create(task: Omit<KanbanTask, 'id' | 'created_at' | 'updated_at'>): Promise<KanbanTask> {
    const { data, error } = await supabase
      .from('kanban_tasks')
      .insert([task])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }

    return data;
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

  // Inicializar dados padrão
  async initializeDefaultData(): Promise<void> {
    try {
      // Verificar se já existem colunas
      const existingColumns = await columnService.getAll();
      
      if (existingColumns.length === 0) {
        // Criar colunas padrão
        await columnService.create({ title: 'A Fazer', color: '#EF4444', position: 0 });
        await columnService.create({ title: 'Em Progresso', color: '#F59E0B', position: 1 });
        await columnService.create({ title: 'Concluído', color: '#10B981', position: 2 });
      }
    } catch (error) {
      console.error('Erro ao inicializar dados padrão:', error);
      throw error;
    }
  }
};
