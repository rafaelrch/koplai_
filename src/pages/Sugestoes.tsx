import React from 'react';
import { Sidebar } from '../components/Sidebar';

export default function Sugestoes() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <div className="flex bg-[#f6f6f6] font-inter min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-2 sm:px-8 lg:ml-[260px] w-full max-w-full">
        <h1 className="text-3xl font-bold text-center">Sugestões</h1>
      </div>
    </div>
  );
} 