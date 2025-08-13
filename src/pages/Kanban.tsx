import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Menu, Search, Plus, X, Edit3, Trash2, Link as LinkIcon, Image as ImageIcon, Video, FileText, MoreHorizontal } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { toast } from "../components/ui/sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Tipos
interface Task {
  id: string;
  title: string;
  description: string;
  attachments: {
    type: 'link' | 'image' | 'video';
    url: string;
    preview?: string;
  }[];
  createdAt: Date;
  columnId: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

// Modal de Detalhes da Tarefa
const TaskDetailModal = ({ 
  task, 
  onClose, 
  onEdit, 
  onDelete 
}: {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [newLink, setNewLink] = useState('');
  const [newFiles, setNewFiles] = useState<File[]>([]);

  // Atualizar editedTask quando task mudar
  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleSave = () => {
    // Processar novos anexos
    const processedAttachments = [...editedTask.attachments];
    
    if (newLink.trim()) {
      processedAttachments.push({
        type: 'link',
        url: newLink.trim()
      });
    }
    
    newFiles.forEach(file => {
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'link';
      
      processedAttachments.push({
        type: fileType as 'link' | 'image' | 'video',
        url: URL.createObjectURL(file),
        preview: file.name
      });
    });

    const updatedTask = {
      ...editedTask,
      attachments: processedAttachments
    };

    onEdit(updatedTask);
    setIsEditing(false);
    setNewLink('');
    setNewFiles([]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxFiles = 5;
    
    if (editedTask.attachments.length + newFiles.length + files.length > maxFiles) {
      alert(`Você pode ter no máximo ${maxFiles} anexos.`);
      return;
    }
    
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') || file.type.startsWith('video/');
      if (!isValid) {
        alert(`Arquivo "${file.name}" não é uma imagem ou vídeo válido.`);
      }
      return isValid;
    });
    
    setNewFiles(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setEditedTask(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Tarefa' : 'Detalhes da Tarefa'}
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </>
            )}
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            {isEditing ? (
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-black"
                rows={4}
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{task.description || 'Sem descrição'}</p>
            )}
          </div>

          {/* Data de Criação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Criado em
            </label>
            <p className="text-gray-600">
              {new Date(task.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>

          {/* Anexos Existentes */}
          {task.attachments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anexos ({task.attachments.length})
              </label>
              <div className="space-y-2">
                {task.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {attachment.type === 'link' && <LinkIcon className="w-5 h-5 text-green-500" />}
                      {attachment.type === 'image' && <ImageIcon className="w-5 h-5 text-blue-500" />}
                      {attachment.type === 'video' && <Video className="w-5 h-5 text-red-500" />}
                      <div>
                        <p className="font-medium text-gray-900">
                          {attachment.type === 'link' ? 'Link' : attachment.preview || 'Anexo'}
                        </p>
                        {attachment.type === 'link' && (
                          <a 
                            href={attachment.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:text-indigo-800 break-all"
                          >
                            {attachment.url}
                          </a>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeAttachment(index)}
                        className="p-1 hover:bg-red-100 rounded text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Adicionar Novos Anexos (apenas em modo de edição) */}
          {isEditing && (
            <div className="space-y-4">
              {/* Novo Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adicionar Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    placeholder="https://exemplo.com"
                  />
                  <button
                    onClick={() => setNewLink('')}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Novos Arquivos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adicionar Arquivos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="detail-file-upload"
                  />
                  <label htmlFor="detail-file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          Clique para selecionar
                        </span>
                        <p className="text-xs text-gray-500">Fotos e vídeos</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Lista de Novos Arquivos */}
              {newFiles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Novos Arquivos
                  </label>
                  <div className="space-y-2">
                    {newFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {file.type.startsWith('image/') ? (
                            <ImageIcon className="w-4 h-4 text-blue-500" />
                          ) : file.type.startsWith('video/') ? (
                            <Video className="w-4 h-4 text-red-500" />
                          ) : (
                            <FileText className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removeNewFile(index)}
                          className="p-1 hover:bg-red-100 rounded text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botões de Ação */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Salvar Alterações
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedTask(task);
                  setNewLink('');
                  setNewFiles([]);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente de Card de Tarefa
const TaskCard = ({ task, onEdit, onUpdate, onDelete }: { 
  task: Task; 
  onEdit: (task: Task) => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}) => {
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    transition: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  // Removendo useDroppable para evitar conflitos com clique
  const isOver = false;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'transform 0.2s ease-in-out',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100
        cursor-grab active:cursor-grabbing
        hover:shadow-md hover:border-indigo-300 
        transition-all duration-300 ease-in-out
        ${isDragging ? 'opacity-60 shadow-xl scale-105 z-50' : ''}
        ${isOver && !isDragging ? 'border-indigo-400 bg-indigo-50 shadow-md' : ''}
      `}
      onClick={(e) => {
        // Não abrir modal se estiver arrastando
        if (isDragging) {
          return;
        }
        
        // Não abrir modal se clicou em um botão
        const target = e.target as HTMLElement;
        if (target.closest('button')) {
          return;
        }
        
        setShowDetailModal(true);
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {task.title}
          </h3>
          {task.attachments.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-gray-500">
                {task.attachments.length} anexo{task.attachments.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetailModal(true);
            }}
            className="p-1 hover:bg-indigo-100 rounded transition-colors"
            title="Ver detalhes"
          >
            <MoreHorizontal className="w-3 h-3 text-indigo-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Editar"
          >
            <Edit3 className="w-3 h-3 text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1 hover:bg-red-100 rounded transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-xs mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Anexos */}
      {task.attachments.length > 0 && (
        <div className="space-y-1 mb-2">
          {task.attachments.map((attachment, index) => (
            <div 
              key={index} 
              className="flex items-center gap-1 text-xs cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                setSelectedAttachment(attachment);
                setShowAttachmentModal(true);
              }}
            >
              {attachment.type === 'link' && (
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded">
                  <LinkIcon className="w-3 h-3" />
                  <span className="truncate max-w-20">Link</span>
                </div>
              )}
              {attachment.type === 'image' && (
                <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  <ImageIcon className="w-3 h-3" />
                  <span className="truncate max-w-20">
                    {attachment.preview || 'Imagem'}
                  </span>
                </div>
              )}
              {attachment.type === 'video' && (
                <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded">
                  <Video className="w-3 h-3" />
                  <span className="truncate max-w-20">
                    {attachment.preview || 'Vídeo'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Visualização de Anexo */}
      {showAttachmentModal && selectedAttachment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Visualizar Anexo
              </h3>
              <button 
                onClick={() => setShowAttachmentModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedAttachment.type === 'link' && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Link:</p>
                  <a 
                    href={selectedAttachment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 break-all"
                  >
                    {selectedAttachment.url}
                  </a>
                </div>
              )}
              
              {selectedAttachment.type === 'image' && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Imagem:</p>
                  <img 
                    src={selectedAttachment.url} 
                    alt={selectedAttachment.preview || 'Imagem'}
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              )}
              
              {selectedAttachment.type === 'video' && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Vídeo:</p>
                  <video 
                    src={selectedAttachment.url} 
                    controls
                    className="max-w-full h-auto rounded-lg"
                  >
                    Seu navegador não suporta vídeos.
                  </video>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Tarefa */}
      {showDetailModal && (
        <TaskDetailModal
          task={task}
          onClose={() => setShowDetailModal(false)}
          onEdit={onUpdate}
          onDelete={onDelete}
        />
      )}

      <div className="text-xs text-gray-400">
        {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

// Componente de Coluna
const Column = ({ 
  column, 
  onAddTask, 
  onEditColumn, 
  onDeleteColumn,
  onEditTask,
  onUpdateTask,
  onDeleteTask 
}: {
  column: Column;
  onAddTask: (columnId: string) => void;
  onEditColumn: (column: Column) => void;
  onDeleteColumn: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`bg-gray-50 rounded-lg p-3 min-w-[280px] max-w-[280px] h-fit border transition-all duration-300 ease-in-out ${
        isOver 
          ? 'border-[#8fb7ff] bg-[#cee0ff]/20' 
          : 'border-transparent hover:border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
            {column.tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEditColumn(column)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <Edit3 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDeleteColumn(column.id)}
            className="p-1 hover:bg-red-100 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      <SortableContext 
        items={column.tasks.map(task => task.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className={`space-y-2 transition-all duration-300 ease-in-out ${isOver && column.tasks.length === 0 ? 'bg-indigo-100 rounded-lg border-2 border-dashed border-indigo-300 flex items-center justify-center scale-[1.02] min-h-[60px]' : ''}`}>
          {column.tasks.length === 0 && isOver && (
            <div className="text-indigo-600 text-sm font-medium py-4 animate-pulse">
              Solte aqui para adicionar à coluna
            </div>
          )}
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      </SortableContext>

      <button
        onClick={() => onAddTask(column.id)}
        className="w-full mt-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <Plus className="w-4 h-4" />
        Adicionar tarefa
      </button>
    </div>
  );
};

// Modal para criar/editar tarefa
const TaskModal = ({ 
  isOpen, 
  onClose, 
  task, 
  onSave,
  columns,
  selectedColumnId
}: {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  columns: Column[];
  selectedColumnId?: string;
}) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [attachments, setAttachments] = useState(task?.attachments || []);
  const [link, setLink] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Por favor, insira um título para a tarefa.');
      return;
    }
    
    const finalColumnId = task?.columnId || selectedColumnId;
    if (!finalColumnId) {
      alert('Erro: Coluna não definida. Por favor, tente novamente.');
      return;
    }
    
    // Processar anexos
    const processedAttachments = [...attachments];
    
    // Adicionar link se fornecido
    if (link.trim()) {
      processedAttachments.push({
        type: 'link',
        url: link.trim()
      });
    }
    
    // Adicionar arquivos selecionados
    selectedFiles.forEach(file => {
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'link';
      
      processedAttachments.push({
        type: fileType as 'link' | 'image' | 'video',
        url: URL.createObjectURL(file),
        preview: file.name
      });
    });

    onSave({
      title: title.trim(),
      description: description.trim(),
      attachments: processedAttachments,
      columnId: finalColumnId,
    });
    onClose();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxFiles = 5;
    
    if (selectedFiles.length + files.length > maxFiles) {
      alert(`Você pode selecionar no máximo ${maxFiles} arquivos.`);
      return;
    }
    
    // Validar tipos de arquivo
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') || file.type.startsWith('video/');
      if (!isValid) {
        alert(`Arquivo "${file.name}" não é uma imagem ou vídeo válido.`);
      }
      return isValid;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
              placeholder="Digite o título da tarefa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-black"
              rows={3}
              placeholder="Digite a descrição da tarefa"
            />
          </div>



          {/* Campo de Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link (opcional)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                placeholder="https://exemplo.com"
              />
              <button
                onClick={() => setLink('')}
                className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Upload de Arquivos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anexar Arquivos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Clique para selecionar
                    </span>
                    <p className="text-xs text-gray-500">Fotos e vídeos (máx. 5 arquivos)</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Lista de Arquivos Selecionados */}
          {selectedFiles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arquivos Selecionados
              </label>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                      ) : file.type.startsWith('video/') ? (
                        <Video className="w-4 h-4 text-red-500" />
                      ) : (
                        <FileText className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-red-100 rounded text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Anexos Existentes */}
          {attachments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anexos Existentes
              </label>
              <div className="space-y-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {attachment.type === 'link' && <LinkIcon className="w-4 h-4 text-green-500" />}
                      {attachment.type === 'image' && <ImageIcon className="w-4 h-4 text-blue-500" />}
                      {attachment.type === 'video' && <Video className="w-4 h-4 text-red-500" />}
                      <span className="text-sm text-gray-700 truncate">
                        {attachment.preview || attachment.url}
                      </span>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="p-1 hover:bg-red-100 rounded text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal para criar/editar coluna
const ColumnModal = ({ 
  isOpen, 
  onClose, 
  column, 
  onSave 
}: {
  isOpen: boolean;
  onClose: () => void;
  column?: Column;
  onSave: (column: Omit<Column, 'id' | 'tasks'>) => void;
}) => {
  const [title, setTitle] = useState(column?.title || '');
  const [color, setColor] = useState(column?.color || '#3B82F6');

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      color,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {column ? 'Editar Coluna' : 'Nova Coluna'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Coluna
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
              placeholder="Ex: A Fazer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === c ? 'border-gray-900 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Kanban() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [columns, setColumns] = useState<Column[]>([
    {
      id: '1',
      title: 'A Fazer',
      color: '#3B82F6',
      tasks: []
    },
    {
      id: '2',
      title: 'Em Progresso',
      color: '#F59E0B',
      tasks: []
    },
    {
      id: '3',
      title: 'Aprovado',
      color: '#10B981',
      tasks: []
    },
    {
      id: '4',
      title: 'Reprovado',
      color: '#EF4444',
      tasks: []
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [taskModal, setTaskModal] = useState<{ isOpen: boolean; task?: Task }>({ isOpen: false });
  const [columnModal, setColumnModal] = useState<{ isOpen: boolean; column?: Column }>({ isOpen: false });
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(columns.flatMap(col => col.tasks).find(task => task.id === event.active.id) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Se arrastou para a mesma posição, não fazer nada
    if (activeId === overId) return;

    setColumns(columns => {
      const oldColumnIndex = columns.findIndex(col => 
        col.tasks.some(task => task.id === activeId)
      );

      if (oldColumnIndex === -1) return columns;

      const oldColumn = columns[oldColumnIndex];
      const activeTask = oldColumn.tasks.find(task => task.id === activeId);

      if (!activeTask) return columns;

      // Verificar se está arrastando para uma coluna
      const newColumnIndex = columns.findIndex(col => col.id === overId);
      
             if (newColumnIndex !== -1) {
         // Arrastou para uma coluna (vazia ou com outras tarefas)
         const newColumn = columns[newColumnIndex];
         
         const newColumns = [...columns];
         
         // Remover da coluna antiga
         newColumns[oldColumnIndex] = {
           ...oldColumn,
           tasks: oldColumn.tasks.filter(task => task.id !== activeId)
         };
         
         // Adicionar à nova coluna
         newColumns[newColumnIndex] = {
           ...newColumn,
           tasks: [...newColumn.tasks, { ...activeTask, columnId: newColumn.id }]
         };
         
         // Toast de confirmação
         toast.success(`Tarefa movida para "${newColumn.title}"`);
         
         return newColumns;
       }

      // Verificar se está arrastando para uma tarefa em outra coluna
      const newColumnIndex2 = columns.findIndex(col => 
        col.tasks.some(task => task.id === overId)
      );

      if (newColumnIndex2 !== -1 && newColumnIndex2 !== oldColumnIndex) {
        // Arrastou para uma tarefa em outra coluna
        const newColumn = columns[newColumnIndex2];
        const overTaskIndex = newColumn.tasks.findIndex(task => task.id === overId);
        
        const newColumns = [...columns];
        
        // Remover da coluna antiga
        newColumns[oldColumnIndex] = {
          ...oldColumn,
          tasks: oldColumn.tasks.filter(task => task.id !== activeId)
        };
        
                 // Adicionar à nova coluna na posição correta
         newColumns[newColumnIndex2] = {
           ...newColumn,
           tasks: [
             ...newColumn.tasks.slice(0, overTaskIndex),
             { ...activeTask, columnId: newColumn.id },
             ...newColumn.tasks.slice(overTaskIndex)
           ]
         };
         
         // Toast de confirmação
         toast.success(`Tarefa movida para "${newColumn.title}"`);
         
         return newColumns;
      }

      // Mover dentro da mesma coluna
      if (oldColumnIndex !== -1) {
        const oldIndex = oldColumn.tasks.findIndex(task => task.id === activeId);
        const newIndex = oldColumn.tasks.findIndex(task => task.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newColumns = [...columns];
          newColumns[oldColumnIndex] = {
            ...oldColumn,
            tasks: arrayMove(oldColumn.tasks, oldIndex, newIndex)
          };
          return newColumns;
        }
      }

      return columns;
    });
  };

  const addColumn = (columnData: Omit<Column, 'id' | 'tasks'>) => {
    const newColumn: Column = {
      id: Date.now().toString(),
      ...columnData,
      tasks: []
    };
    setColumns([...columns, newColumn]);
  };

  const editColumn = (columnData: Omit<Column, 'id' | 'tasks'>) => {
    if (!columnModal.column) return;
    setColumns(columns.map(col => 
      col.id === columnModal.column!.id 
        ? { ...col, ...columnData }
        : col
    ));
  };

  const deleteColumn = (columnId: string) => {
    setColumns(columns.filter(col => col.id !== columnId));
  };

  const addTaskToColumn = (columnId: string) => {
    setTaskModal({ isOpen: true });
    setActiveTask({ 
      id: '', 
      title: '', 
      description: '', 
      attachments: [], 
      createdAt: new Date(), 
      columnId 
    } as Task);
  };

  const saveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (taskModal.task) {
      // Editar tarefa existente
      setColumns(columns.map(col => ({
        ...col,
        tasks: col.tasks.map(task => 
          task.id === taskModal.task!.id 
            ? { ...task, ...taskData }
            : task
        )
      })));
    } else {
      // Nova tarefa
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
        createdAt: new Date()
      };
      

      
      setColumns(columns.map(col => 
        col.id === taskData.columnId 
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      ));
    }
  };

  const editTask = (task: Task) => {
    setTaskModal({ isOpen: true, task });
  };

  const updateTask = (updatedTask: Task) => {
    setColumns(prevColumns => {
      return prevColumns.map(col => ({
        ...col,
        tasks: col.tasks.map(task => 
          task.id === updatedTask.id 
            ? { ...task, ...updatedTask }
            : task
        )
      }));
    });
  };

  const deleteTask = (taskId: string) => {
    setColumns(columns.map(col => ({
      ...col,
      tasks: col.tasks.filter(task => task.id !== taskId)
    })));
  };

  const filteredColumns = columns.map(col => ({
    ...col,
    tasks: col.tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  return (
    <div className="flex bg-[#f6f6f6] font-inter min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start py-2 px-4 sm:px-20 lg:ml-[260px] w-full max-w-full">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30 w-full max-w-6xl mx-auto rounded-t-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-semibold text-gray-900 text-lg">Koplai</span>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Container central branco */}
        <div className="w-full max-w-full bg-white rounded-2xl p-6 sm:p-10 m-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Kanban</h1>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar tarefas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64 text-black"
                />
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                <button
                  onClick={() => setColumnModal({ isOpen: true })}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nova Coluna
                </button>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 overflow-x-auto pb-4 transition-all duration-300 ease-in-out">
              {filteredColumns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  onAddTask={addTaskToColumn}
                  onEditColumn={(col) => setColumnModal({ isOpen: true, column: col })}
                  onDeleteColumn={deleteColumn}
                  onEditTask={editTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              ))}
            </div>
          </DndContext>

          {/* Estado vazio */}
          {filteredColumns.every(col => col.tasks.length === 0) && searchTerm && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
                <p className="text-gray-500">
                  Tente ajustar os termos de busca para encontrar o que você está procurando.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      <TaskModal
        isOpen={taskModal.isOpen}
        onClose={() => setTaskModal({ isOpen: false })}
        task={taskModal.task}
        onSave={saveTask}
        columns={columns}
        selectedColumnId={activeTask?.columnId}
      />

      <ColumnModal
        isOpen={columnModal.isOpen}
        onClose={() => setColumnModal({ isOpen: false })}
        column={columnModal.column}
        onSave={columnModal.column ? editColumn : addColumn}
      />
    </div>
  );
} 