import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AgentDetailPage() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAgent() {
      const { data, error } = await supabase.from('agentes').select('*').eq('id', id).single();
      if (data) setAgent(data);
    }
    fetchAgent();
  }, [id]);

  if (!agent) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Carregando agente...</div>;
  }

  async function handleGenerate() {
    setLoading(true);
    // Aqui você pode integrar com a OpenAI futuramente
    setTimeout(() => {
      setOutput(`Resposta gerada para: "${input}"`);
      setLoading(false);
    }, 1200);
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-white py-8 px-2">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
        {/* Lado esquerdo: Inputs */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-2">
            {agent.avatar_url && (
              <img src={agent.avatar_url} alt={agent.nome} className="w-14 h-14 rounded-lg object-cover" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-[#3b82f6]">{agent.nome}</h2>
              <p className="text-gray-500 text-sm">{agent.descricao}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3b82f6] mb-2">Entrada</label>
            <textarea
              className="w-full min-h-[100px] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-3 text-[15px] placeholder-[#94a3b8] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition"
              placeholder="Digite sua solicitação para o agente..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !input}
            className="mt-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg w-full transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 focus:ring-offset-2 disabled:opacity-60"
          >
            {loading ? 'Gerando...' : 'Gerar'}
          </button>
        </div>
        {/* Lado direito: Output */}
        <div className="flex-1 flex flex-col gap-4">
          <label className="block text-sm font-semibold text-[#3b82f6] mb-2">Resposta do agente</label>
          <div className="flex-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4 text-gray-700 min-h-[100px] whitespace-pre-line">
            {output || <span className="text-gray-400">A resposta aparecerá aqui...</span>}
          </div>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="bg-white border border-[#3b82f6] text-[#3b82f6] font-semibold py-2 px-4 rounded-lg hover:bg-[#3b82f6] hover:text-white transition disabled:opacity-60"
          >
            Copiar resposta
          </button>
        </div>
      </div>
    </div>
  );
} 