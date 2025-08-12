import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  MoreVertical, 
  Link as LinkIcon, 
  Paperclip, 
  Image as ImageIcon, 
  Video,
  Edit2,
  Trash2
} from 'lucide-react';
import { KanbanTask } from '../../types/kanban';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface TaskCardProps {
  task: KanbanTask;
  onEdit: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasLinks = task.links.length > 0;
  const hasAttachments = task.attachments.length > 0;
  const imageAttachments = task.attachments.filter(a => a.type === 'image');
  const videoAttachments = task.attachments.filter(a => a.type === 'video');

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white border border-gray-200 rounded-lg p-4 mb-3 cursor-grab
        hover:shadow-md hover:border-gray-300 transition-all duration-200
        ${isDragging ? 'shadow-lg scale-105' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">
          {task.title}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
          {truncateText(task.description, 120)}
        </p>
      )}

      {/* Indicators */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {hasLinks && (
          <div className="flex items-center gap-1">
            <LinkIcon className="h-3 w-3" />
            <span>{task.links.length}</span>
          </div>
        )}
        
        {hasAttachments && (
          <div className="flex items-center gap-1">
            <Paperclip className="h-3 w-3" />
            <span>{task.attachments.length}</span>
          </div>
        )}

        {imageAttachments.length > 0 && (
          <div className="flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            <span>{imageAttachments.length}</span>
          </div>
        )}

        {videoAttachments.length > 0 && (
          <div className="flex items-center gap-1">
            <Video className="h-3 w-3" />
            <span>{videoAttachments.length}</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasAttachments && (
        <div className="flex gap-1 mt-3">
          {task.attachments.slice(0, 3).map((attachment) => (
            <div
              key={attachment.id}
              className="w-8 h-8 rounded border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center"
            >
              {attachment.type === 'image' && attachment.thumbnail ? (
                <img
                  src={attachment.thumbnail}
                  alt={attachment.name}
                  className="w-full h-full object-cover"
                />
              ) : attachment.type === 'video' ? (
                <Video className="h-4 w-4 text-gray-400" />
              ) : (
                <ImageIcon className="h-4 w-4 text-gray-400" />
              )}
            </div>
          ))}
          {task.attachments.length > 3 && (
            <div className="w-8 h-8 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-500">
              +{task.attachments.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Excluir tarefa</h3>
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
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
                  onDelete(task.id);
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