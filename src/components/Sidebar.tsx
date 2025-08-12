import React, { useEffect, useState } from 'react';
import { Settings, BarChart3, Bot, Users, Lightbulb, Video, Image, History, MessageCircle, LogOut, Trello } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import ReactDOM from 'react-dom';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Estado para usuário logado
  const [user, setUser] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const menuItems = [
    { name: 'Agentes', icon: Bot, path: '/agentes' },
    { name: 'Histórico', icon: History, path: '/historico' },
    { name: 'Comunidade', icon: Users, path: '/comunidade' },
    { name: 'Sugestões', icon: MessageCircle, path: '/sugestoes' },
    { name: 'Kanban', icon: Trello, path: '/kanban' },
    { name: 'Vídeo', icon: Video, path: '/video', badge: 'Em breve' },
    { name: 'Imagem', icon: Image, path: '/imagem', badge: 'Em breve' },
    { name: 'Configuração', icon: Settings, path: '/configuracao' },
  ];

  useEffect(() => {
    const fetchUserAndCompany = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndCompany();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

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
          bg-white w-[260px] py-6 px-4 flex flex-col h-screen fixed left-0 top-0 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Conteúdo que rola */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto min-h-0">
          {/* Logo grande no topo */}
          <div className="flex flex-col items-center mb-2">
            <img
              src="/koplai_logo.svg"
              alt="Logo Koplai"
              className="w-42 h-42 sm:w-48 sm:h-42 lg:w-42 lg:h-56 max-w-full max-h-[200px] mb-2 object-contain"
            />
          </div>
          {/* Menu Items */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item, index) => {
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
              return (
                <div key={index} className="relative">
                  <Link to={item.path}>
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer
                        ${isActive ? 'bg-indigo-500/10 text-black font-semibold' : 'text-sm font-medium text-gray-400'}
                        hover:bg-gray-100
                      `}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-500' : 'text-gray-400'}`} />
                      <span className={`text-sm ${isActive ? 'text-black font-semibold' : 'font-medium text-gray-400'}`}>{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs text-red-400 bg-red-100 px-2 py-1 rounded-md">{item.badge}</span>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </nav>
                </div>
        
        {/* Usuário logado fixo no rodapé */}
        {isLoading ? (
          <div className="flex items-center gap-3 px-4 py-2 mb-2 mt-2 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-2 mb-2 mt-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setShowLogoutModal(true)}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent((user?.user_metadata?.nome || '') + ' ' + (user?.user_metadata?.sobrenome || '') || user?.email || 'U')}&background=3b82f6&color=fff`}
              alt={((user?.user_metadata?.nome || '') + ' ' + (user?.user_metadata?.sobrenome || '')).trim() || user?.email || 'Usuário'}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-base font-semibold text-black leading-tight truncate">
                {user?.user_metadata?.nome && user?.user_metadata?.sobrenome 
                  ? `${user.user_metadata.nome} ${user.user_metadata.sobrenome}`
                  : user?.user_metadata?.nome 
                  ? user.user_metadata.nome
                  : user?.email?.split('@')[0] || 'Usuário'
                }
              </span>
              <span className="text-xs text-gray-400 truncate">
                {user?.email || ''}
              </span>
            </div>
            <LogOut className="w-5 h-5 text-gray-400" />
          </div>
        )}

        {/* Modal de confirmação de logout */}
        {showLogoutModal && ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs w-full flex flex-col items-center">
              <span className="text-lg font-semibold mb-4 text-black">Deseja realmente sair?</span>
              <div className="flex gap-4 mt-2 w-full">
                <button
                  className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </>
  );
};
