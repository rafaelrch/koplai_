import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Trophy, Lightbulb, Users, BarChart3, Video, MessageCircle, FileText, Target, Briefcase, Megaphone, Copy as CopyIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AnimatedMarkdown } from '../components/AnimatedMarkdown';
import { toast } from "../components/ui/sonner";

export default function AgentDetailPage({ agentId, onBack }) {
  const [agent, setAgent] = useState(null);
  const [inputs, setInputs] = useState<string[]>([]);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchAgent() {
      const { data } = await supabase.from('agents').select('*').eq('id', agentId).single();
      if (data) {
        setAgent(data);
        setInputs(Array.isArray(data.inputs) ? Array(data.inputs.length).fill('') : []);
      }
    }
    if (agentId) fetchAgent();
  }, [agentId]);

  function handleInputChange(idx: number, value: string) {
    setInputs(inputs => {
      const newInputs = [...inputs];
      newInputs[idx] = value;
      return newInputs;
    });
  }

  // Função para chamar a OpenAI
  async function callOpenAI(messages: any[]): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7
      })
    });
    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    throw new Error('Erro ao gerar resposta da OpenAI');
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const messages = [
        { role: 'system', content: agent.systemPrompt || 'Você é um assistente de marketing.' },
        ...agent.inputs.map((input, i) => ({
          role: 'user',
          content: `${input.label}: ${inputs[i]}`
        }))
      ];
      const resposta = await callOpenAI(messages);
      setOutput(resposta);
      toast.success("Resposta gerada com sucesso!");
      // Salvar histórico no Supabase
      const user = await supabase.auth.getUser();
      if (user.data && user.data.user) {
        await supabase.from('history').insert([
          {
            user_id: user.data.user.id,
            agent_id: agentId,
            input: JSON.stringify(inputs),
            response: resposta
          }
        ]);
      }
    } catch (e) {
      setOutput('Erro ao gerar resposta.');
    }
    setLoading(false);
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!agent) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Carregando agente...</div>;
  }

  function getAgentIcon() {
    const name = agent.name?.toLowerCase() || '';
    const tags = Array.isArray(agent.tags) ? agent.tags.map(t => t.toLowerCase()) : [];
    if (name.includes('conteúdo') || tags.includes('conteúdo')) return <FileText className="w-10 h-10 text-gray-600" />;
    if (name.includes('cliente') || tags.includes('cliente')) return <Users className="w-10 h-10 text-gray-600" />;
    if (name.includes('estratégia') || tags.includes('estratégia')) return <Lightbulb className="w-10 h-10 text-gray-600" />;
    if (name.includes('campanha') || tags.includes('campanha')) return <Megaphone className="w-10 h-10 text-gray-600" />;
    if (name.includes('briefing') || tags.includes('briefing')) return <FileText className="w-10 h-10 text-gray-600" />;
    if (name.includes('planejador') || tags.includes('planejamento')) return <Target className="w-10 h-10 text-gray-600" />;
    if (name.includes('marca') || tags.includes('marca')) return <BarChart3 className="w-10 h-10 text-gray-600" />;
    if (name.includes('vídeo') || tags.includes('vídeo')) return <Video className="w-10 h-10 text-gray-600" />;
    if (name.includes('mensagem') || tags.includes('mensagem')) return <MessageCircle className="w-10 h-10 text-gray-600" />;
    return <Trophy className="w-10 h-10 text-gray-600" />;
  }

  const Spinner = () => (
    <svg className="animate-spin h-6 w-6 text-gray-400 mx-auto mt-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  );

  return (
    <div className="w-full h-full flex items-stretch justify-center bg-[#f6f6f6] py-10 px-4 gap-8">
      {/* Card de input (esquerda) */}
      <div className="flex-1 h-full flex flex-col gap-6">
        {/* Card superior com ícone, nome e descrição */}
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            {getAgentIcon()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{agent.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{agent.description}</p>
          </div>
        </div>
        {/* Card de input dinâmico */}
        <div className="bg-white rounded-2xl  p-6 flex flex-col gap-3 flex-1">
          {agent.inputs?.map((inputConfig, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-base font-semibold text-gray-900 mb-1">{inputConfig.label}</label>
              <textarea
                className="w-full min-h-[130px] bg-white border border-[#e2e8f0] rounded-lg px-4 py-3 text-[15px] placeholder-[#94a3b8] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition resize-none"
                placeholder={inputConfig.placeholder}
                value={inputs[idx]}
                onChange={e => handleInputChange(idx, e.target.value)}
              />
            </div>
          ))}
          {/* Botões Voltar e Gerar na mesma linha, colados nas extremidades inferiores */}
          <div className="flex items-center w-full mt-auto">
            <button
              onClick={onBack}
              className="text-sm text-gray-500 hover:underline  border px-4 py-2 rounded-md hover:bg-black/5 hover:text-black duration-200 ease-in-out"
            >
              Voltar
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading || inputs.every(val => !val)}
              className="bg-black hover:bg-black/90 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black/40 focus:ring-offset-2 ml-auto"
            >
              {loading ? 'Gerando...' : 'Gerar'}
            </button>
          </div>
        </div>
        {/* Card de output (direita) */}
      </div>
      <div className="flex-1 h-full">
        <div className="bg-white rounded-2xl  p-6 flex flex-col gap-3 h-full min-h-[300px]">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-base font-semibold text-gray-900">Output</label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className={`flex items-center gap-2 text-gray-500 border border-gray-300 rounded-lg px-3 py-1 text-sm hover:bg-gray-100 transition disabled:opacity-60 relative ${copied ? 'bg-green-100 border-green-400 text-green-700 animate-pulse' : ''}`}
            >
              <CopyIcon className={`w-4 h-4 ${copied ? 'text-green-700' : 'text-gray-400'} transition-colors`} />
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <div className="flex-1 text-gray-700 min-h-[120px] max-h-[600px] overflow-y-auto rounded-md">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center"><Spinner /></div>
            ) : output ? (
              <div className="prose max-w-none w-full text-left"><AnimatedMarkdown text={output} /></div>
            ) : (
              <span className="text-gray-400">A resposta aparecerá aqui...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 