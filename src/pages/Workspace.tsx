import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Calendar,
  Users,
  Clock,
  Star,
  MoreVertical
} from 'lucide-react';

export default function Workspace() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Dados mockados para demonstração
  const projects = [
    {
      id: 1,
      name: 'Projeto Marketing Digital',
      description: 'Campanha de marketing para Q4 2024',
      status: 'Em andamento',
      members: 5,
      lastUpdate: '2 horas atrás',
      priority: 'Alta',
      type: 'Marketing',
      responsible: 'Ana Silva'
    },
    {
      id: 2,
      name: 'Redesign Website',
      description: 'Atualização completa do site corporativo',
      status: 'Concluído',
      members: 3,
      lastUpdate: '1 dia atrás',
      priority: 'Média',
      type: 'Design',
      responsible: 'Carlos Santos'
    },
    {
      id: 3,
      name: 'Análise de Dados',
      description: 'Relatório trimestral de performance',
      status: 'Pendente',
      members: 2,
      lastUpdate: '3 dias atrás',
      priority: 'Baixa',
      type: 'Análise',
      responsible: 'Maria Costa'
    },
    {
      id: 4,
      name: 'App Mobile',
      description: 'Desenvolvimento do aplicativo iOS/Android',
      status: 'Em andamento',
      members: 8,
      lastUpdate: '5 horas atrás',
      priority: 'Alta',
      type: 'Desenvolvimento',
      responsible: 'João Oliveira'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento':
        return 'bg-blue-100 text-blue-800';
      case 'Concluído':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return 'bg-red-100 text-red-800';
      case 'Média':
        return 'bg-orange-100 text-orange-800';
      case 'Baixa':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex bg-[#f6f6f6] font-inter min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start py-10 px-2 sm:px-8 lg:ml-[260px] w-full max-w-full">
        <div className="w-full max-w-6xl flex flex-col items-center">
          {/* Header */}
          <div className="w-full bg-white rounded-2xl shadow mb-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Workspace</h1>
                <p className="text-sm text-gray-600 mt-1">Gerencie seus projetos e colaborações</p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo Projeto
              </Button>
            </div>
          </div>

                    {/* Stats Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Projetos</p>
                    <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                  </div>
                  <FolderOpen className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projects.filter(p => p.status === 'Em andamento').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Concluídos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projects.filter(p => p.status === 'Concluído').length}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="w-full flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar projetos..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Filtrar</Button>
              <Button variant="outline">Ordenar</Button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 mb-3">
                        {project.description}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {project.responsible}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{project.members} membros</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{project.lastUpdate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State (hidden when there are projects) */}
          {projects.length === 0 && (
            <div className="w-full text-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto encontrado</h3>
              <p className="text-gray-600 mb-6">Comece criando seu primeiro projeto para organizar seu trabalho.</p>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Criar Primeiro Projeto
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 