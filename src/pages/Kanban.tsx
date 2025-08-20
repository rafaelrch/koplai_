import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Menu, Search, Plus, X, Edit3, Trash2, Link as LinkIcon, Image as ImageIcon, Video, FileText, MoreHorizontal, Download, ExternalLink, Loader2 } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { toast } from "../components/ui/sonner";
import { kanbanService, columnService, taskService, KanbanColumn as DBColumn, KanbanTask as DBTask } from '../lib/kanbanService';
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
  links: {
    type: 'link';
    url: string;
    preview?: string;
  }[];
  arquivos: {
    type: 'image' | 'video';
    url: string;
    preview?: string;
  }[];
  // Mantemos attachments para compatibilidade durante migração
  attachments?: {
    type: 'link' | 'image' | 'video';
    url: string;
    preview?: string;
  }[];
  createdAt: Date;
  columnId: string;
  position: number;
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  position: number;
}





// Componente de Card de Tarefa
const TaskCard = ({ task, onUpdate, onDelete, onOpenAttachment }: { 
  task: Task; 
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onOpenAttachment: (attachment: any) => void;
}) => {
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
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
      className={`
        bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100
        hover:shadow-md hover:border-indigo-300 
        transition-all duration-300 ease-in-out
        ${isDragging ? 'opacity-60 shadow-xl scale-105 z-50' : ''}
        ${isOver && !isDragging ? 'border-indigo-400 bg-indigo-50 shadow-md' : ''}
      `}

    >
      <div className="flex items-start justify-between mb-2">
        <div 
          {...listeners}
          className="flex-1 min-w-0 cursor-grab active:cursor-grabbing"
        >
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {task.title}
          </h3>
          
          {/* Ícones de anexos */}
          {((task.links && task.links.length > 0) || (task.arquivos && task.arquivos.length > 0) || (task.attachments && task.attachments.length > 0)) && (
            <div className="flex items-center gap-1 mt-1">
              {/* Ícone de link se existir */}
              {((task.links && task.links.length > 0) || (task.attachments && task.attachments.some(att => att.type === 'link'))) && (
                <LinkIcon className="w-3 h-3 text-blue-500" />
              )}
              
              {/* Ícone de imagem se existir imagem ou vídeo */}
              {((task.arquivos && task.arquivos.length > 0) || (task.attachments && task.attachments.some(att => att.type === 'image' || att.type === 'video'))) && (
                <svg className="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              )}
            </div>
          )}

        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowEditModal(true);
            }}
            className="p-1.5 hover:bg-blue-100 rounded transition-colors cursor-pointer z-10 relative"
            title="Editar tarefa"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete(task.id);
            }}
            className="p-1.5 hover:bg-red-100 rounded transition-colors cursor-pointer z-10 relative"
            title="Excluir tarefa"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      </div>
      
      <div
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>


      </div>



      {/* Modal de Edição de Tarefa */}
      {showEditModal && (
        <EditTaskModal
          task={task}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedTask) => {
            onUpdate(updatedTask);
            setShowEditModal(false);
          }}
          onOpenAttachment={onOpenAttachment}
        />
      )}

      <div 
        {...listeners}
        className="text-xs text-gray-400 cursor-grab active:cursor-grabbing"
      >
        {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

// Modal para editar tarefa
const EditTaskModal = ({ 
  task,
  isOpen, 
  onClose, 
  onSave,
  onOpenAttachment
}: {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onOpenAttachment: (attachment: any) => void;
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [link, setLink] = useState('');
  const [links, setLinks] = useState(task.links || []);
  const [arquivos, setArquivos] = useState<{type: 'image' | 'video'; url: string; preview?: string; size?: number; uploadedAt?: Date}[]>(task.arquivos || []);
  // Compatibilidade com estrutura antiga
  const [attachments, setAttachments] = useState<{type: 'link' | 'image' | 'video'; url: string; preview?: string; size?: number; uploadedAt?: Date}[]>(task.attachments || []);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);

  // Reset campos quando a tarefa mudar
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setLinks(task.links || []);
      setArquivos(task.arquivos || []);
      // Compatibilidade com estrutura antiga
      setAttachments(task.attachments || []);
      setLink('');
      setSelectedFiles([]);
    }
  }, [task]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Por favor, insira um título para a tarefa.');
      return;
    }

    // Processar links
    const processedLinks = [...links];
    if (link.trim()) {
      processedLinks.push({
        type: 'link' as const,
        url: link.trim()
      });
    }
    
    // Processar arquivos
    const processedArquivos = [...arquivos];
    selectedFiles.forEach(file => {
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      
      processedArquivos.push({
        type: fileType as 'image' | 'video',
        url: URL.createObjectURL(file),
        preview: file.name
      });
    });

    // Manter compatibilidade com estrutura antiga durante migração
    const processedAttachments = [
      ...processedLinks,
      ...processedArquivos
    ];

    onSave({
      ...task,
      title: title.trim(),
      description: description.trim(),
      links: processedLinks,
      arquivos: processedArquivos,
      attachments: processedAttachments, // Para compatibilidade
    });
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



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex">
      {/* Overlay - clica para fechar */}
      <div 
        className="flex-1"
        onClick={onClose}
      />
      
      {/* Painel lateral direito */}
      <div className={`bg-white w-full max-w-3xl h-full shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tighter">Editar tarefa</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder=""
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-900 placeholder-gray-400"
                rows={3}
                placeholder=""
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Link
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder=""
              />
            </div>

            {/* Seção de Arquivos em duas colunas */}
            <div className="grid grid-cols-2 gap-4">
              {/* Adicionar arquivo */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Adicionar arquivo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="edit-file-upload"
                  />
                  <label htmlFor="edit-file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Plus className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-indigo-600 mb-0.5">Adicionar arquivos</p>
                        <p className="text-xs text-gray-500">Imagens e vídeos (máx. 5 arquivos)</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Links existentes */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Links existentes
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {/* Links da nova estrutura */}
                  {links.map((linkItem, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div 
                        className="flex items-center gap-2 flex-1 cursor-pointer hover:bg-gray-100 rounded p-1 transition-colors"
                        onClick={() => {
                          let url = linkItem.url;
                          if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            url = 'https://' + url;
                          }
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                          <LinkIcon className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-xs text-blue-600 truncate hover:underline">
                          {linkItem.url}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLinks(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="p-1 hover:bg-red-100 rounded text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  
                  {/* Novo link se adicionado */}
                  {link.trim() && (
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <div 
                        className="flex items-center gap-2 flex-1 cursor-pointer hover:bg-blue-100 rounded p-1 transition-colors"
                        onClick={() => {
                          let url = link;
                          if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            url = 'https://' + url;
                          }
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                          <LinkIcon className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-xs text-blue-600 truncate hover:underline">
                          {link}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLink('');
                        }}
                        className="p-1 hover:bg-red-100 rounded text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Anexos Existentes */}
            {(selectedFiles.length > 0 || arquivos.length > 0 || attachments.filter(att => att.type !== 'link').length > 0) && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Anexos Existentes
                </label>
                <div className="space-y-3">
                  {/* Arquivos da nova estrutura */}
                  {arquivos.map((arquivo, index) => (
                    <div key={`arquivo-${index}`} className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors"
                        onClick={() => {
                          onOpenAttachment(arquivo);
                        }}
                      >
                        {arquivo.type === 'image' ? (
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img 
                              src={arquivo.url} 
                              alt={arquivo.preview || 'Imagem'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Video className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {arquivo.preview || 'arquivo.png'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {arquivo.type === 'image' ? 'Imagem' : 'Vídeo'} • {arquivo.type.toUpperCase()}
                            {arquivo.size && ` • ${(arquivo.size / 1024).toFixed(1)} KB`}
                            {arquivo.uploadedAt && ` • ${arquivo.uploadedAt.toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setArquivos(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="p-1 hover:bg-red-100 rounded text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  
                  {/* Arquivos selecionados */}
                  {selectedFiles.map((file, index) => (
                    <div key={`selected-${index}`} className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors"
                        onClick={() => {
                          const fileAttachment = {
                            type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
                            url: URL.createObjectURL(file),
                            preview: file.name,
                            size: file.size,
                            uploadedAt: new Date()
                          };
                          onOpenAttachment(fileAttachment);
                        }}
                      >
                        {file.type.startsWith('image/') ? (
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Video className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.type.startsWith('image/') ? 'Imagem' : 'Vídeo'} • {file.type.split('/')[1].toUpperCase()} • {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="p-1 hover:bg-red-100 rounded text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer fixo na parte inferior */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            Salvar
          </button>
        </div>
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
  onUpdateTask,
  onDeleteTask,
  onOpenAttachment
}: {
  column: Column;
  onAddTask: (columnId: string) => void;
  onEditColumn: (column: Column) => void;
  onDeleteColumn: (columnId: string) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAttachment: (attachment: any) => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`bg-gray-50 rounded-lg p-3 min-w-[280px] max-w-[280px] h-fit border transition-all duration-300 ease-in-out overflow-visible ${
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
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              onOpenAttachment={onOpenAttachment}
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

// Modal para criar tarefa
const CreateTaskModal = ({ 
  isOpen, 
  onClose, 
  onSave,
  columns,
  selectedColumnId
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  columns: Column[];
  selectedColumnId?: string;
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState<{type: 'link'; url: string; preview?: string}[]>([]);
  const [arquivos, setArquivos] = useState<{type: 'image' | 'video'; url: string; preview?: string}[]>([]);
  const [attachments, setAttachments] = useState<{type: 'link' | 'image' | 'video'; url: string; preview?: string}[]>([]);
  const [link, setLink] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Limpar campos quando modal abrir
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setLinks([]);
      setArquivos([]);
      setAttachments([]);
      setLink('');
      setSelectedFiles([]);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Por favor, insira um título para a tarefa.');
      return;
    }
    
    if (!selectedColumnId) {
      alert('Erro: Coluna não definida. Por favor, tente novamente.');
      return;
    }
    
    // Processar links
    const processedLinks = [...links];
    if (link.trim()) {
      processedLinks.push({
        type: 'link' as const,
        url: link.trim()
      });
    }
    
    // Processar arquivos
    const processedArquivos = [...arquivos];
    selectedFiles.forEach(file => {
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      
      processedArquivos.push({
        type: fileType as 'image' | 'video',
        url: URL.createObjectURL(file),
        preview: file.name
      });
    });

    // Manter compatibilidade com estrutura antiga
    const processedAttachments = [
      ...processedLinks,
      ...processedArquivos
    ];

    onSave({
      title: title.trim(),
      description: description.trim(),
      links: processedLinks,
      arquivos: processedArquivos,
      attachments: processedAttachments,
      columnId: selectedColumnId,
      position: 0,
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



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Nova Tarefa</h2>
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



          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Criar Tarefa
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
      position: 0,
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
  
  // Configuração das colunas para "Tarefas do dia"
  const dailyColumns: Column[] = [
    {
      id: 'daily-1',
      title: 'A Fazer',
      color: '#3B82F6',
      position: 0,
      tasks: []
    },
    {
      id: 'daily-2',
      title: 'Produzindo',
      color: '#F59E0B',
      position: 1,
      tasks: []
    },
    {
      id: 'daily-3',
      title: 'Em aprovação',
      color: '#EC4899',
      position: 2,
      tasks: []
    },
    {
      id: 'daily-4',
      title: 'Com o cliente',
      color: '#10B981',
      position: 3,
      tasks: []
    }
  ];

  // Configuração das colunas para "Aprovação interna"
  const approvalColumns: Column[] = [
    {
      id: 'approval-1',
      title: 'Pendente',
      color: '#F59E0B',
      position: 0,
      tasks: []
    },
    {
      id: 'approval-2',
      title: 'Em revisão',
      color: '#8B5CF6',
      position: 1,
      tasks: []
    },
    {
      id: 'approval-3',
      title: 'Aprovado',
      color: '#10B981',
      position: 2,
      tasks: []
    },
    {
      id: 'approval-4',
      title: 'Reprovado',
      color: '#EF4444',
      position: 3,
      tasks: []
    }
  ];

  const [columns, setColumns] = useState<Column[]>(dailyColumns);

  const [searchTerm, setSearchTerm] = useState('');
  const [createTaskModal, setCreateTaskModal] = useState<{ isOpen: boolean; columnId?: string }>({ isOpen: false });
  const [columnModal, setColumnModal] = useState<{ isOpen: boolean; column?: Column }>({ isOpen: false });
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'approval'>('daily');
  const [showGlobalAttachmentModal, setShowGlobalAttachmentModal] = useState(false);
  const [globalSelectedAttachment, setGlobalSelectedAttachment] = useState<any>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Função para alternar entre visualizações
  const switchView = async (view: 'daily' | 'approval') => {
    if (switchLoading) return; // Evitar cliques múltiplos
    
    setActiveTab(view);
    setSwitchLoading(true);
    
    try {
      // Carregar dados específicos da visualização
      const { columns: dbColumns, tasks: dbTasks } = await kanbanService.loadKanbanByView(view);
      
      // Converter dados do banco para o formato do componente
      const convertedColumns: Column[] = dbColumns.map(dbCol => ({
        id: dbCol.id,
        title: dbCol.title,
        color: dbCol.color,
        position: dbCol.position,
        tasks: dbTasks
          .filter(dbTask => dbTask.column_id === dbCol.id)
          .map(dbTask => ({
            id: dbTask.id,
            title: dbTask.title,
            description: dbTask.description,
            links: dbTask.links || [],
            arquivos: dbTask.arquivos || [],
            // Compatibilidade com estrutura antiga - combinar links e arquivos
            attachments: [...(dbTask.links || []), ...(dbTask.arquivos || [])],
            createdAt: new Date(dbTask.created_at),
            columnId: dbTask.column_id,
            position: dbTask.position
          }))
          .sort((a, b) => a.position - b.position)
      })).sort((a, b) => a.position - b.position);

      setColumns(convertedColumns);
    } catch (error) {
      console.error('Erro ao carregar dados da visualização:', error);
      toast.error('Erro ao carregar dados');
      // Fallback para colunas locais
      if (view === 'daily') {
        setColumns(dailyColumns);
      } else {
        setColumns(approvalColumns);
      }
    } finally {
      setSwitchLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Carregar dados do banco de dados
  const loadDataFromDB = async () => {
    try {
      setLoading(true);
      await kanbanService.initializeDefaultData();
      const { columns: dbColumns, tasks: dbTasks } = await kanbanService.loadKanbanByView(activeTab);
      
      // Converter dados do banco para o formato do componente
      const convertedColumns: Column[] = dbColumns.map(dbCol => ({
        id: dbCol.id,
        title: dbCol.title,
        color: dbCol.color,
        position: dbCol.position,
        tasks: dbTasks
          .filter(dbTask => dbTask.column_id === dbCol.id)
          .map(dbTask => ({
            id: dbTask.id,
            title: dbTask.title,
            description: dbTask.description,
            links: dbTask.links || [],
            arquivos: dbTask.arquivos || [],
            // Compatibilidade com estrutura antiga - combinar links e arquivos
            attachments: [...(dbTask.links || []), ...(dbTask.arquivos || [])],
            createdAt: new Date(dbTask.created_at),
            columnId: dbTask.column_id,
            position: dbTask.position
          }))
          .sort((a, b) => a.position - b.position)
      })).sort((a, b) => a.position - b.position);

      setColumns(convertedColumns);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do banco');
      // Fallback para colunas locais
      if (activeTab === 'daily') {
        setColumns(dailyColumns);
      } else {
        setColumns(approvalColumns);
      }
          } finally {
        setSwitchLoading(false);
        setLoading(false);
      }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      await switchView('daily');
      setLoading(false);
    };
    
    initializeApp();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(columns.flatMap(col => col.tasks).find(task => task.id === event.active.id) || null);
  };

    const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Se arrastou para a mesma posição, não fazer nada
    if (activeId === overId) return;

    // Encontrar a tarefa que está sendo movida
    const oldColumnIndex = columns.findIndex(col => 
      col.tasks.some(task => task.id === activeId)
    );

    if (oldColumnIndex === -1) return;

    const oldColumn = columns[oldColumnIndex];
    const activeTask = oldColumn.tasks.find(task => task.id === activeId);

    if (!activeTask) return;

    // Verificar se está arrastando para uma coluna
    const newColumnIndex = columns.findIndex(col => col.id === overId);
    
    if (newColumnIndex !== -1) {
      // Arrastou para uma coluna (vazia ou com outras tarefas)
      const newColumn = columns[newColumnIndex];
      
      try {
        // Verificar se é uma tarefa de exemplo (não persiste no banco)
        if (!activeTask.id.startsWith('sample-')) {
          // Atualizar no banco de dados
          await taskService.update(activeTask.id, {
            title: activeTask.title,
            description: activeTask.description,
            column_id: newColumn.id,
            position: newColumn.tasks.length, // Posição no final da nova coluna
            links: activeTask.links,
            arquivos: activeTask.arquivos,

            view_type: activeTab
          });
        }

        // Atualizar estado local
        setColumns(prevColumns => {
          const newColumns = [...prevColumns];
          
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
          
          return newColumns;
        });
        
        // Toast de confirmação
        toast.success(`Tarefa movida para "${newColumn.title}"`);
        
      } catch (error) {
        console.error('Erro ao mover tarefa:', error);
        toast.error('Erro ao mover tarefa');
      }
      return;
    }

    // Verificar se está arrastando para uma tarefa em outra coluna
    const newColumnIndex2 = columns.findIndex(col => 
      col.tasks.some(task => task.id === overId)
    );

    if (newColumnIndex2 !== -1 && newColumnIndex2 !== oldColumnIndex) {
      // Arrastou para uma tarefa em outra coluna
      const newColumn = columns[newColumnIndex2];
      const overTaskIndex = newColumn.tasks.findIndex(task => task.id === overId);
      
      try {
        // Verificar se é uma tarefa de exemplo (não persiste no banco)
        if (!activeTask.id.startsWith('sample-')) {
          // Atualizar no banco de dados
          await taskService.update(activeTask.id, {
            title: activeTask.title,
            description: activeTask.description,
            column_id: newColumn.id,
            position: overTaskIndex, // Posição específica na nova coluna
            links: activeTask.links,
            arquivos: activeTask.arquivos,

            view_type: activeTab
          });
        }

        // Atualizar estado local
        setColumns(prevColumns => {
          const newColumns = [...prevColumns];
          
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
          
          return newColumns;
        });
        
        // Toast de confirmação
        toast.success(`Tarefa movida para "${newColumn.title}"`);
        
      } catch (error) {
        console.error('Erro ao mover tarefa:', error);
        toast.error('Erro ao mover tarefa');
      }
      return;
    }

    // Mover dentro da mesma coluna
    if (oldColumnIndex !== -1) {
      const oldIndex = oldColumn.tasks.findIndex(task => task.id === activeId);
      const newIndex = oldColumn.tasks.findIndex(task => task.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        try {
          // Verificar se é uma tarefa de exemplo (não persiste no banco)
          if (!activeTask.id.startsWith('sample-')) {
            // Atualizar posição no banco de dados
            await taskService.update(activeTask.id, {
              title: activeTask.title,
              description: activeTask.description,
              column_id: activeTask.columnId,
              position: newIndex, // Nova posição na mesma coluna
              links: activeTask.links,
              arquivos: activeTask.arquivos,
  
              view_type: activeTab
            });
          }

          // Atualizar estado local
          setColumns(prevColumns => {
            const newColumns = [...prevColumns];
            newColumns[oldColumnIndex] = {
              ...oldColumn,
              tasks: arrayMove(oldColumn.tasks, oldIndex, newIndex)
            };
            return newColumns;
          });
          
        } catch (error) {
          console.error('Erro ao reordenar tarefa:', error);
          toast.error('Erro ao reordenar tarefa');
        }
      }
    }
  };

  const addColumn = async (columnData: Omit<Column, 'id' | 'tasks'>) => {
    try {
      const newDBColumn = await columnService.create({
        title: columnData.title,
        color: columnData.color,
        position: columns.length,
        view_type: activeTab
      });

      const newColumn: Column = {
        id: newDBColumn.id,
        title: newDBColumn.title,
        color: newDBColumn.color,
        position: newDBColumn.position,
        tasks: []
      };

      setColumns([...columns, newColumn]);
      toast.success('Coluna criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar coluna:', error);
      toast.error('Erro ao criar coluna');
    }
  };

  const editColumn = async (columnData: Omit<Column, 'id' | 'tasks'>) => {
    if (!columnModal.column) return;
    
    try {
      await columnService.update(columnModal.column.id, {
        title: columnData.title,
        color: columnData.color,
        position: columnData.position
      });

      setColumns(columns.map(col => 
        col.id === columnModal.column!.id 
          ? { ...col, ...columnData }
          : col
      ));
      toast.success('Coluna atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar coluna:', error);
      toast.error('Erro ao atualizar coluna');
    }
  };

  const deleteColumn = async (columnId: string) => {
    try {
      await columnService.delete(columnId);
      setColumns(columns.filter(col => col.id !== columnId));
      toast.success('Coluna deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar coluna:', error);
      toast.error('Erro ao deletar coluna');
    }
  };

  const addTaskToColumn = (columnId: string) => {
    setCreateTaskModal({ isOpen: true, columnId });
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      // Nova tarefa
      const newDBTask = await taskService.create({
        title: taskData.title,
        description: taskData.description,
        column_id: taskData.columnId,
        position: taskData.position,
        links: taskData.links,
        arquivos: taskData.arquivos,

        view_type: activeTab
      });

      const newTask: Task = {
        id: newDBTask.id,
        title: newDBTask.title,
        description: newDBTask.description,
        links: newDBTask.links || [],
        arquivos: newDBTask.arquivos || [],
        attachments: [...(newDBTask.links || []), ...(newDBTask.arquivos || [])], // Combinar para compatibilidade
        createdAt: new Date(newDBTask.created_at),
        columnId: newDBTask.column_id,
        position: newDBTask.position
      };
      
      setColumns(columns.map(col => 
        col.id === taskData.columnId 
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      ));
      toast.success('Tarefa criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa');
    }
  };



  const updateTask = async (updatedTask: Task) => {
    try {
      await taskService.update(updatedTask.id, {
        title: updatedTask.title,
        description: updatedTask.description,
        column_id: updatedTask.columnId,
        position: updatedTask.position,
        links: updatedTask.links,
        arquivos: updatedTask.arquivos
      });

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
      toast.success('Tarefa atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await taskService.delete(taskId);
      setColumns(columns.map(col => ({
        ...col,
        tasks: col.tasks.filter(task => task.id !== taskId)
      })));
      toast.success('Tarefa deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      toast.error('Erro ao deletar tarefa');
    }
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
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Carregando dados...</span>
            </div>
          )}

          {/* Header */}
          {!loading && (
            <>
            
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

              {/* Switch Button */}
              <div className="mb-6">
                <div className="relative inline-flex bg-gray-100 rounded-lg p-1 shadow-sm">
                  {/* Indicador deslizante animado */}
                  <div 
                    className={`absolute top-1 h-[calc(100%-8px)] bg-white rounded-md shadow-md transition-all duration-300 ease-in-out ${
                      activeTab === 'daily' 
                        ? 'left-1 w-[130px]' 
                        : 'left-[133px] w-[140px]'
                    }`}
                  />
                  
                  <button
                    onClick={() => switchView('daily')}
                    disabled={switchLoading}
                    className={`relative z-10 w-[130px] py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === 'daily'
                        ? 'text-gray-900 bg-transparent'
                        : 'text-gray-600 hover:text-gray-800 bg-transparent'
                    } ${switchLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {switchLoading && activeTab === 'daily' && (
                        <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      Tarefas do dia
                    </div>
                  </button>
                  
                  <button
                    onClick={() => switchView('approval')}
                    disabled={switchLoading}
                    className={`relative z-10 w-[140px] py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === 'approval'
                        ? 'text-gray-900 bg-transparent'
                        : 'text-gray-600 hover:text-gray-800 bg-transparent'
                    } ${switchLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {switchLoading && activeTab === 'approval' && (
                        <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      Aprovação interna
                    </div>
                  </button>
                </div>
              </div>
              

              {/* Kanban Board */}
              <div className={`transition-all duration-300 ease-in-out ${switchLoading ? 'opacity-70' : 'opacity-100'}`}>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex gap-6 overflow-x-auto overflow-y-visible pb-4 transition-all duration-300 ease-in-out">
                    {filteredColumns.map((column) => (
                      <Column
                        key={column.id}
                        column={column}
                        onAddTask={addTaskToColumn}
                        onEditColumn={(col) => setColumnModal({ isOpen: true, column: col })}
                        onDeleteColumn={deleteColumn}
                        onUpdateTask={updateTask}
                        onDeleteTask={deleteTask}
                        onOpenAttachment={(attachment) => {
                          setGlobalSelectedAttachment(attachment);
                          setShowGlobalAttachmentModal(true);
                        }}
                      />
                    ))}
                  </div>
                </DndContext>
              </div>

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
            </>
          )}
        </div>
      </div>

      {/* Modais */}
      <CreateTaskModal
        isOpen={createTaskModal.isOpen}
        onClose={() => setCreateTaskModal({ isOpen: false })}
        onSave={createTask}
        columns={columns}
        selectedColumnId={createTaskModal.columnId}
      />

      <ColumnModal
        isOpen={columnModal.isOpen}
        onClose={() => setColumnModal({ isOpen: false })}
        column={columnModal.column}
        onSave={columnModal.column ? editColumn : addColumn}
      />

      {/* Modal Global de Visualização de Anexo */}
      {showGlobalAttachmentModal && globalSelectedAttachment && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowGlobalAttachmentModal(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {globalSelectedAttachment.preview || 'Arquivo'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {globalSelectedAttachment.type === 'image' && 'Imagem'}
                  {globalSelectedAttachment.type === 'video' && 'Vídeo'}
                  {globalSelectedAttachment.type === 'link' && 'Link'}
                  {globalSelectedAttachment.size && ` • ${(globalSelectedAttachment.size / 1024).toFixed(1)} KB`}
                  {globalSelectedAttachment.uploadedAt && ` • ${globalSelectedAttachment.uploadedAt.toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={async () => {
                    if (globalSelectedAttachment.type === 'link') {
                      // Para links, abrir em nova aba
                      const url = globalSelectedAttachment.url.startsWith('http://') || globalSelectedAttachment.url.startsWith('https://') 
                        ? globalSelectedAttachment.url 
                        : 'https://' + globalSelectedAttachment.url;
                      window.open(url, '_blank');
                    } else {
                      // Para arquivos, fazer download
                      try {
                        setDownloadLoading(true);
                        
                        // Verificar se é uma blob URL (arquivo local) ou URL externa
                        if (globalSelectedAttachment.url.startsWith('blob:')) {
                          // Para blob URLs (arquivos selecionados localmente)
                          const link = document.createElement('a');
                          link.href = globalSelectedAttachment.url;
                          link.download = globalSelectedAttachment.preview || 'arquivo';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          // Para URLs externas, fazer fetch
                          const response = await fetch(globalSelectedAttachment.url, {
                            mode: 'cors'
                          });
                          
                          if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                          }
                          
                          const blob = await response.blob();
                          
                          const link = document.createElement('a');
                          const objectUrl = URL.createObjectURL(blob);
                          link.href = objectUrl;
                          link.download = globalSelectedAttachment.preview || 'arquivo';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          
                          // Limpar o URL temporário
                          URL.revokeObjectURL(objectUrl);
                        }
                        
                        toast.success('Arquivo baixado com sucesso!');
                      } catch (error) {
                        console.error('Erro ao baixar arquivo:', error);
                        
                        // Se falhar, tentar método alternativo (abrir em nova aba)
                        try {
                          window.open(globalSelectedAttachment.url, '_blank');
                          toast.info('Arquivo aberto em nova aba. Use Ctrl+S para salvar.');
                        } catch (fallbackError) {
                          toast.error('Erro ao baixar arquivo. Verifique sua conexão e tente novamente.');
                        }
                      } finally {
                        setDownloadLoading(false);
                      }
                    }
                  }}
                  className={`p-2 rounded-full transition-colors group ${
                    downloadLoading 
                      ? 'bg-blue-50 cursor-not-allowed' 
                      : 'hover:bg-blue-50 cursor-pointer'
                  }`}
                  title={
                    downloadLoading 
                      ? 'Baixando...' 
                      : globalSelectedAttachment.type === 'link' 
                        ? 'Abrir link' 
                        : 'Baixar arquivo'
                  }
                  disabled={downloadLoading}
                >
                  {downloadLoading ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : globalSelectedAttachment.type === 'link' ? (
                    <ExternalLink className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                  ) : (
                    <Download className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                  )}
                </button>
                <button 
                  onClick={() => setShowGlobalAttachmentModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Fechar"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {globalSelectedAttachment.type === 'link' && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LinkIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Link</h4>
                  <a 
                    href={globalSelectedAttachment.url.startsWith('http://') || globalSelectedAttachment.url.startsWith('https://') ? globalSelectedAttachment.url : 'https://' + globalSelectedAttachment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 break-all font-medium underline"
                  >
                    {globalSelectedAttachment.url}
                  </a>
                </div>
              )}
              
              {globalSelectedAttachment.type === 'image' && (
                <div className="text-center">
                  <img 
                    src={globalSelectedAttachment.url} 
                    alt={globalSelectedAttachment.preview || 'Imagem'}
                    className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                    style={{ maxHeight: '60vh' }}
                  />
                </div>
              )}
              
              {globalSelectedAttachment.type === 'video' && (
                <div className="text-center">
                  <video 
                    src={globalSelectedAttachment.url} 
                    controls
                    className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                    style={{ maxHeight: '60vh' }}
                  >
                    Seu navegador não suporta vídeos.
                  </video>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Clique fora da área para fechar
                </div>
                <button
                  onClick={() => setShowGlobalAttachmentModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 