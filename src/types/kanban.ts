export interface KanbanColumn {
  id: string;
  title: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  columnId: string;
  order: number;
  links: TaskLink[];
  attachments: TaskAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskLink {
  id: string;
  url: string;
  title: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  thumbnail?: string;
}

export interface KanbanBoard {
  columns: KanbanColumn[];
  tasks: KanbanTask[];
}

export interface CreateTaskData {
  title: string;
  description: string;
  columnId: string;
  links: Omit<TaskLink, 'id'>[];
  attachments: File[];
}

export interface CreateColumnData {
  title: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string;
}

export interface UpdateColumnData {
  id: string;
  title: string;
} 