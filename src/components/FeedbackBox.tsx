import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const faces = [
  {
    label: 'Triste',
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#F3F4F6"/><path d="M26 27c-1-1.333-2.667-2-5-2s-4 .667-5 2" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round"/><circle cx="15" cy="18" r="2" fill="#A3A3A3"/><circle cx="25" cy="18" r="2" fill="#A3A3A3"/></svg>
    )
  },
  {
    label: 'Neutro',
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#F3F4F6"/><path d="M15 27h10" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round"/><circle cx="15" cy="18" r="2" fill="#A3A3A3"/><circle cx="25" cy="18" r="2" fill="#A3A3A3"/></svg>
    )
  },
  {
    label: 'Feliz',
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#F3F4F6"/><path d="M15 25c1 1.333 2.667 2 5 2s4-.667 5-2" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round"/><circle cx="15" cy="18" r="2" fill="#A3A3A3"/><circle cx="25" cy="18" r="2" fill="#A3A3A3"/></svg>
    )
  }
];

const FeedbackBox: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUserEmail();
  }, []);

  const handleSubmit = async () => {
    console.log('=== DEBUG SUBMIT ===');
    console.log('selected:', selected);
    console.log('userEmail:', userEmail);
    console.log('text:', text);
    
    if (selected === null || selected === undefined) {
      alert('Por favor, selecione uma experiência.');
      return;
    }
    
    if (!userEmail) {
      alert('Por favor, certifique-se de estar logado.');
      return;
    }
    
    setIsLoading(true);
    
    const feedbackData = {
      email: userEmail,
      experiencia: faces[selected].label,
      comentario: text,
      data: new Date().toISOString()
    };

    try {
      console.log('=== ENVIANDO FEEDBACK ===');
      console.log('Dados do usuário:', feedbackData);
      console.log('Email do usuário:', userEmail);
      console.log('Experiência selecionada:', selected, faces[selected].label);
      
      // Criar URL com parâmetros
      const params = new URLSearchParams({
        email: feedbackData.email,
        experiencia: feedbackData.experiencia,
        comentario: feedbackData.comentario,
        data: feedbackData.data
      });
      
      const scriptUrl = `https://script.google.com/macros/s/AKfycbx4b5MkVSe6fIn4ltLnJpdhhQhraapUtNBdAjSloAcg6TVZFhTpviwL5h-NO4-EYi0tjA/exec?${params}`;
      
      console.log('URL completa:', scriptUrl);
      console.log('Parâmetros:', params.toString());
      
      // Solução mais simples: abrir em nova aba e fechar automaticamente
      const newWindow = window.open(scriptUrl, '_blank', 'width=1,height=1,scrollbars=no,resizable=no');
      
      if (!newWindow) {
        throw new Error('Bloqueador de pop-ups ativo. Desative temporariamente.');
      }
      
      // Fechar a janela após 2 segundos
      setTimeout(() => {
        if (newWindow && !newWindow.closed) {
          newWindow.close();
        }
      }, 2000);
      
      // Simular sucesso (o script foi executado)
      setSent(true);
      setText('');
      setSelected(null);
      
      console.log('Feedback enviado com sucesso via nova janela');
      
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      alert(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-black">Como foi a experiência e como podemos melhorar?</h2>
        <div className="flex justify-center gap-6 mb-6">
          {faces.map((face, idx) => (
            <button
              key={face.label}
              className={`rounded-full p-1 border-2 transition-all ${selected === idx ? 'border-blue-600 bg-blue-50' : 'border-transparent'}`}
              onClick={() => {
                console.log('Clicou no rosto:', idx, face.label);
                setSelected(idx);
                console.log('selected agora é:', idx);
              }}
              aria-label={face.label}
            >
              {face.svg}
            </button>
          ))}
        </div>
        <textarea
          className=" text-black w-full border border-gray-300 rounded-lg p-3 mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
          placeholder="Conte-nos mais..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white font-semibold rounded-lg py-2 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={sent || selected === null || isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
        {sent && (
          <div className="text-green-600 text-center mt-4">Obrigado pelo feedback!</div>
        )}
    </div>
  );
};

export default FeedbackBox;