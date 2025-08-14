-- Criar tabela de colunas do Kanban
CREATE TABLE IF NOT EXISTS kanban_columns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de tarefas do Kanban
CREATE TABLE IF NOT EXISTS kanban_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  column_id UUID NOT NULL REFERENCES kanban_columns(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_column_id ON kanban_tasks(column_id);
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_position ON kanban_tasks(position);
CREATE INDEX IF NOT EXISTS idx_kanban_columns_position ON kanban_columns(position);

-- Habilitar Row Level Security (RLS)
ALTER TABLE kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_tasks ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (permitir acesso público para demonstração)
CREATE POLICY "Allow public read access to kanban_columns" ON kanban_columns
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to kanban_columns" ON kanban_columns
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to kanban_columns" ON kanban_columns
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to kanban_columns" ON kanban_columns
  FOR DELETE USING (true);

CREATE POLICY "Allow public read access to kanban_tasks" ON kanban_tasks
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to kanban_tasks" ON kanban_tasks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to kanban_tasks" ON kanban_tasks
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to kanban_tasks" ON kanban_tasks
  FOR DELETE USING (true);

-- Inserir dados de exemplo
INSERT INTO kanban_columns (title, color, position) VALUES
  ('A Fazer', '#EF4444', 0),
  ('Em Progresso', '#F59E0B', 1),
  ('Concluído', '#10B981', 2)
ON CONFLICT DO NOTHING;

-- Inserir algumas tarefas de exemplo
INSERT INTO kanban_tasks (title, description, column_id, position) VALUES
  ('Implementar autenticação', 'Adicionar sistema de login e registro', 
   (SELECT id FROM kanban_columns WHERE title = 'A Fazer' LIMIT 1), 0),
  ('Criar dashboard', 'Desenvolver interface do dashboard principal', 
   (SELECT id FROM kanban_columns WHERE title = 'Em Progresso' LIMIT 1), 0),
  ('Testar funcionalidades', 'Realizar testes de todas as funcionalidades', 
   (SELECT id FROM kanban_columns WHERE title = 'Concluído' LIMIT 1), 0)
ON CONFLICT DO NOTHING;
