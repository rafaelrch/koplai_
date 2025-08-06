import React from 'react';
import { Sidebar } from '../components/Sidebar';

export default function Comunidade() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <div className="flex bg-[#f6f6f6] font-inter min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-2 sm:px-8 lg:ml-[260px] w-full max-w-full">        
        <div className="bg-white rounded-2xl p-8 max-w-3xl w-full text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-6 tracking-tighter">Entre na comunidade do Discord</h2>
          
          <div className="flex items-center justify-center gap-4">
            <img 
              src="/logoDiscord.png" 
              alt="Logo Discord" 
              className="w-20 h-20 object-contain"
            />
            <a 
              href="https://discord.gg/7w4qkhxh" 
              className="text-[#5865F2] font-medium hover:text-[#4752C4] transition-colors text-xl tracking-tighter"
              target="_blank"
              rel="noopener noreferrer"
            >
              Acessar Comunidade
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 