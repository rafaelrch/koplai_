import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Sidebar } from '../components/Sidebar';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      const user = await supabase.auth.getUser();
      if (!user.data || !user.data.user) {
        setHistory([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('history')
        .select('*, agents(name)')
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false });
      if (error) {
        setHistory([]);
      } else {
        setHistory(data || []);
      }
      setLoading(false);
    }
    fetchHistory();
  }, []);

  const selected = history[selectedIndex] || null;

  return (
    <div className="flex bg-[#f6f6f6] font-inter min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start py-10 px-2 sm:px-8 lg:ml-[260px] w-full max-w-full">
        <div className="w-full max-w-6xl flex flex-col items-center">
          <div className="w-full bg-white rounded-2xl shadow flex flex-col md:flex-row min-h-[600px]">
            {/* Coluna esquerda: lista de históricos */}
            <div className="w-full md:w-1/3 border-r border-gray-100 flex flex-col rounded-l-2xl overflow-hidden">
              <h1 className="text-3xl font-bold text-center py-8">Historico</h1>
              {loading ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">Carregando...</div>
              ) : history.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">Nenhum histórico encontrado.</div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  {history.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-6 py-4 focus:outline-none transition bg-transparent ${selectedIndex === idx ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'hover:bg-gray-50'}`}
                    >
                      <div className="font-medium truncate">{item.agents?.name || 'Título do agente'}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Coluna direita: detalhes */}
            <div className="flex-1 flex flex-col p-8 overflow-y-auto min-w-0">
              {selected ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">{selected.agents?.name || 'Título do agente'}</h2>
                    <span className="text-xs text-gray-400">{new Date(selected.created_at).toLocaleString()}</span>
                  </div>
                  <div className="mb-4">
                    <div className="font-semibold mb-1">Input:</div>
                    <pre className="bg-gray-100 rounded p-3 text-sm whitespace-pre-wrap break-words">{(() => {
                      try {
                        return JSON.parse(selected.input).join('\n');
                      } catch {
                        return selected.input;
                      }
                    })()}</pre>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Resposta:</div>
                    <pre className="bg-gray-100 rounded p-3 text-sm whitespace-pre-wrap break-words">{selected.response}</pre>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">Selecione um item do histórico.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 