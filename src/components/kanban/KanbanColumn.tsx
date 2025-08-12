import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { 
  MoreVertical, 
  Plus, 
  Edit2, 
  Trash2,
  GripVertical
} from 'lucide-react';
import { KanbanColumn as ColumnType, KanbanTask } from '../../types/kanban';
import { TaskCard } from './TaskCard';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Input } from '../ui/input';

interface KanbanColumnProps {
  column: ColumnType;
  tasks: KanbanTask[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: KanbanTask) => void;
  onDeleteTask: (taskId: string) => void;
  onEditColumn: (column: ColumnType) => void;
  onDeleteColumn: (columnId: string) => void;
  onReorderTasks: (columnId: string, taskIds: string[]) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onEditColumn,
  onDeleteColumn,
  onReorderTasks,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const sortedTasks = tasks.sort((a, b) => a.order - b.order);
  const taskIds = sortedTasks.map(task => task.id);

  const handleSaveTitle = () => {
    if (newTitle.trim()) {
      onEditColumn({ ...column, title: newTitle.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setNewTitle(column.title);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        min-w-[300px] max-w-[350px] bg-gray-50 rounded-lg p-4
        ${isOver ? 'bg-blue-50 border-2 border-blue-200' : ''}
        transition-all duration-200
      `}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-1">
          <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
          
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="h-8 text-sm font-semibold"
                autoFocus
              />
              <Button size="sm" onClick={handleSaveTitle} className="h-8 px-2">
                ✓
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-8 px-2">
                ✕
              </Button>
            </div>
          ) : (
            <h3 className="font-semibold text-gray-900 text-sm flex-1">
              {column.title}
            </h3>
          )}
          
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Editar coluna
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir coluna
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tasks Container */}
      <div className="min-h-[200px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="h-6 w-6" />
            </div>
            <p className="text-sm mb-3">Nenhuma tarefa</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddTask(column.id)}
              className="text-xs"
            >
              Adicionar tarefa
            </Button>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      {tasks.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddTask(column.id)}
          className="w-full mt-3 text-gray-600 hover:text-gray-900"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar tarefa
        </Button>
      )}

      {/* Delete Column Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Excluir coluna</h3>
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja excluir a coluna "{column.title}"? 
              Todas as tarefas serão perdidas.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDeleteColumn(column.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1"
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 