import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

export default function Kanban() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

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
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Container central branco */}
        <div className="w-full max-w-full bg-white rounded-2xl p-6 sm:p-10 m-10">
          {/* Page title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Kanban
          </h1>
          
          {/* Conteúdo da página Kanban */}
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Página Kanban</h3>
              <p className="text-gray-500">
                Esta é a página Kanban. Aqui você pode implementar funcionalidades de gerenciamento de tarefas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 