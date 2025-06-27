import React from 'react';
import { Trophy, Lightbulb, Users, BarChart3, Video, MessageCircle, FileText, Target, Briefcase, Megaphone } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  tags: string | string[] | Array<{ name: string; color?: string }>;
}

interface AgentCardProps {
  agent: Agent;
}

// Mapeamento das cores para cada tag
const tagColorMap: Record<string, string> = {
  'Copywriting': 'text-yellow-500',
  'Youtube': 'text-red-600',
  'Instagram': 'text-pink-600',
  'Cliente': 'text-lime-600',
  'Marketing': 'text-yellow-700',
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  // tags pode ser string ("Copywriting,Marketing") ou array
  let tags: Array<{ name: string; color?: string }> = [];
  if (typeof agent.tags === 'string') {
    tags = agent.tags.split(',').map((tag) => ({ name: tag.trim() }));
  } else if (Array.isArray(agent.tags)) {
    // Se for array de string, converte para array de objetos
    if (agent.tags.length > 0 && typeof agent.tags[0] === 'string') {
      tags = (agent.tags as string[]).map((tag) => ({ name: tag }));
    } else {
      tags = agent.tags as Array<{ name: string; color?: string }>;
    }
  }

  // Função para escolher o ícone conforme o nome ou tags do agente
  function getAgentIcon() {
    const name = agent.name.toLowerCase();
    const tagsLower = tags.map(t => t.name.toLowerCase());
    if (name.includes('conteúdo') || tagsLower.includes('conteúdo')) return <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />;
    if (name.includes('cliente') || tagsLower.includes('cliente')) return <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />;
    if (name.includes('estratégia') || tagsLower.includes('estratégia')) return <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />;
    if (name.includes('campanha') || tagsLower.includes('campanha')) return <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />;
    if (name.includes('briefing') || tagsLower.includes('briefing')) return <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />;
    if (name.includes('planejador') || tagsLower.includes('planejamento')) return <Target className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />;
    if (name.includes('marca') || tagsLower.includes('marca')) return <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />;
    if (name.includes('vídeo') || tagsLower.includes('vídeo')) return <Video className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />;
    if (name.includes('mensagem') || tagsLower.includes('mensagem')) return <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />;
    return <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-[#dfdfdf] hover:border-[#585dff] hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer group h-full flex flex-col">
      {/* Trophy icon */}
      <div className="mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200 ease-in-out">
        {getAgentIcon()}
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`uppercase font-bold text-xs tracking-wide ${tagColorMap[tag.name] || 'text-gray-500'}`}
          >
            {tag.name}
          </span>
        ))}
      </div>
      
      {/* Agent name */}
      <h3 className="text-lg sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 transition-colors duration-200 ease-in-out">
        {agent.name}
      </h3>
      
      
      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
        {agent.description}
      </p>
    </div>
  );
};
