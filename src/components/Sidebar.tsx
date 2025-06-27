import React, { useEffect, useState } from 'react';
import { Settings, Home, BarChart3, Bot, Users, Lightbulb, Video, Image, History, MessageCircle, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const menuItems = [
    { name: 'Introdução', icon: Home, active: false },
    { name: 'Agentes', icon: Bot, active: true },
    { name: 'Histórico', icon: History, active: false },
    { name: 'Comunidade', icon: Users, active: false },
    { name: 'Sugestões', icon: MessageCircle, active: false },
    { name: 'Vídeo', icon: Video, active: false, badge: 'Em breve' },
    { name: 'Imagem', icon: Image, active: false, badge: 'Em breve' },
  ];

  // Estado para usuário logado
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      {/* Sidebar */}
      <div
        className={`
          bg-white w-[260px] py-6 px-4 flex flex-col h-screen
          fixed lg:static top-0 left-0 z-50 lg:z-0
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Conteúdo que rola */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto min-h-0">
          {/* Logo grande no topo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 mb-2 flex items-center justify-center bg-gray-200 rounded-lg">
              {/* Placeholder simples para logo removida */}
            </div>
            <span className="text-2xl font-bold text-gray-900 leading-none flex items-baseline gap-1">
              Koplai <span className="text-xs align-super font-normal ml-1">AI</span>
            </span>
          </div>
          {/* Menu Items */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item, index) => (
              <div key={index} className="relative">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer
                    ${item.active ? 'bg-indigo-500/10 text-black font-semibold' : 'text-sm font-medium text-gray-400'}
                    hover:bg-gray-100
                  `}
                >
                  <item.icon className={`w-5 h-5 ${item.active ? 'text-indigo-500' : 'text-gray-400'}`} />
                  <span className={`text-sm ${item.active ? 'text-black font-semibold' : 'font-medium text-gray-400'}`}>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs text-red-400 bg-red-100 px-2 py-1 rounded-md">{item.badge}</span>
                  )}
                </div>
              </div>
            ))}
          </nav>
        </div>
        {/* Usuário logado fixo no rodapé */}
        <div className="flex items-center gap-3 px-4 py-2 mb-2 mt-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent((user?.user_metadata?.nome || '') + ' ' + (user?.user_metadata?.sobrenome || '') || user?.email || 'U')}&background=3b82f6&color=fff`}
            alt={((user?.user_metadata?.nome || '') + ' ' + (user?.user_metadata?.sobrenome || '')).trim() || user?.email || 'Usuário'}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-base font-semibold text-black leading-tight truncate">
              {user?.user_metadata?.nome || ''} {user?.user_metadata?.sobrenome || ''}
              {!(user?.user_metadata?.nome || user?.user_metadata?.sobrenome) && user?.email}
            </span>
            <span className="text-xs text-gray-400 truncate">{user?.email || ''}</span>
          </div>
          <LogOut className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </>
  );
};
