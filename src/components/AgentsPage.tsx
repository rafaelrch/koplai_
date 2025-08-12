import React, { useState, useEffect } from 'react';
import { Menu, Search } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { AgentFilters } from './AgentFilters';
import { AgentCard } from './AgentCard';
import { useIsMobile } from '../hooks/use-mobile';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import AgentDetailPage from '../pages/AgentDetailPage';

export const AgentsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const isMobile = useIsMobile();
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAgents() {
      try {
        console.log('Buscando agentes...');
        
        // Verificar se o usuário está autenticado
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Usuário autenticado:', user);
        
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Erro ao buscar agentes:', error);
          return;
        }
        
        console.log('Agentes encontrados:', data);
        if (data) setAgents(data);
      } catch (err) {
        console.error('Erro inesperado ao buscar agentes:', err);
      }
    }
    fetchAgents();
  }, []);

  const filteredAgents = activeFilter === 'Todos'
    ? agents
    : agents.filter(agent => {
        // tags pode ser string ou array
        const tags = typeof agent.tags === 'string' ? agent.tags.split(',') : agent.tags;
        return tags && tags.some(tag => tag === activeFilter || tag.name === activeFilter);
      });

  return (
    <div className="flex bg-[#f6f6f6] font-inter min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start py-2 px-4 sm:px-20 lg:ml-[260px] w-full max-w-full">
        {selectedAgentId ? (
          <AgentDetailPage agentId={selectedAgentId} onBack={() => setSelectedAgentId(null)} />
        ) : (
          <>
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
                <div className="w-10"></div> {/* Spacer for centering */}
              </div>
            </div>
            {/* Container central branco */}
            <div className="w-full max-w-full bg-white rounded-2xl p-6 sm:p-10 m-10">
              {/* Page title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Agentes
              </h1>
              {/* Filters */}
              <AgentFilters 
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
              {/* Agents grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAgents.map((agent) => (
                  <div key={agent.id} onClick={() => setSelectedAgentId(agent.id)} className="cursor-pointer">
                    <AgentCard agent={agent} />
                  </div>
                ))}
              </div>
              {/* Empty state */}
              {filteredAgents.length === 0 && (
                <div className="text-center py-12 sm:py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agente encontrado</h3>
                    <p className="text-gray-500 mb-4">
                      Tente ajustar os filtros para encontrar o que você está procurando.
                    </p>
                    <button
                      onClick={() => setActiveFilter('Todos')}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Ver todos os agentes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
