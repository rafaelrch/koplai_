import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Máscara de telefone brasileiro
function maskPhone(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
}

// Força da senha
function getPasswordStrength(password: string) {
  if (password.length < 8) return 0;
  let score = 0;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    senha: '',
  });
  const [touched, setTouched] = useState<{[k: string]: boolean}>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Validação dos campos
  const errors = {
    nome: !form.nome ? 'Nome obrigatório' : '',
    sobrenome: !form.sobrenome ? 'Sobrenome obrigatório' : '',
    email: !/\S+@\S+\.\S+/.test(form.email) ? 'Email inválido' : '',
    telefone: form.telefone.replace(/\D/g, '').length < 11 ? 'Telefone inválido' : '',
    senha: form.senha.length < 8 ? 'Mínimo 8 caracteres' : '',
  };
  const isFormValid = Object.values(errors).every(e => !e);

  // Handler de mudança
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === 'telefone' ? maskPhone(value) : value,
    }));
    if (error) setError('');
  }

  // Handler de blur
  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  }

  // Submit - CADASTRO INDIVIDUAL
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ 
      nome: true, sobrenome: true, email: true, telefone: true, senha: true
    });
    if (!isFormValid) return;
    
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
        options: {
          data: {
            nome: form.nome,
            sobrenome: form.sobrenome,
            telefone: form.telefone,
          }
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user) {
        await supabase.from('profiles').insert({
          id: authData.user.id,
          name: form.nome + ' ' + form.sobrenome,
          email: form.email,
          phone: form.telefone
        });
        
        setSuccess(true);
        setForm({ nome: '', sobrenome: '', email: '', telefone: '', senha: '' });
        setTouched({});
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }

    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // Força da senha
  const strength = getPasswordStrength(form.senha);
  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-white py-8 px-2">
      <div className="w-full max-w-[500px] bg-white border border-[#e2e8f0] rounded-2xl p-10 flex flex-col">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/koplai_logo.svg"
            alt="Logo Koplai"
            className="w-44 h-44 mb-6 object-contain"
          />
          <h1 className="text-[28px] font-semibold text-[#2d3748] mb-2 font-sans">Crie sua conta!</h1>
        </div>

        {/* Toast de sucesso */}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-center text-sm">
            ✅ Cadastro realizado com sucesso! Por favor, confirme seu cadastro no email antes de fazer login.
          </div>
        )}

        {/* Toast de erro */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-center text-sm">
            ❌ {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dados pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Dados Pessoais</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <input
                name="nome"
                type="text"
                placeholder="Nome"
                className={`w-full bg-[#f8fafc] border ${touched.nome && errors.nome ? 'border-red-400' : 'border-[#e2e8f0]'} rounded-lg px-4 py-3 text-[14px] text-black placeholder-[#94a3b8] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition`}
                value={form.nome}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <input
                name="sobrenome"
                type="text"
                placeholder="Sobrenome"
                className={`w-full bg-[#f8fafc] border ${touched.sobrenome && errors.sobrenome ? 'border-red-400' : 'border-[#e2e8f0]'} rounded-lg px-4 py-3 text-[14px] text-black placeholder-[#94a3b8] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition`}
                value={form.sobrenome}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            {touched.nome && errors.nome && <span className="text-xs text-red-500">{errors.nome}</span>}
            {touched.sobrenome && errors.sobrenome && <span className="text-xs text-red-500">{errors.sobrenome}</span>}
            
            <input
              name="email"
              type="email"
              placeholder="Email"
              className={`w-full bg-[#f8fafc] border ${touched.email && errors.email ? 'border-red-400' : 'border-[#e2e8f0]'} rounded-lg px-4 py-3 text-[14px] text-black placeholder-[#94a3b8] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition`}
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {touched.email && errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
            
            <input
              name="telefone"
              type="tel"
              placeholder="Telefone"
              className={`w-full bg-[#f8fafc] border ${touched.telefone && errors.telefone ? 'border-red-400' : 'border-[#e2e8f0]'} rounded-lg px-4 py-3 text-[14px] text-black placeholder-[#94a3b8] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition`}
              value={form.telefone}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              maxLength={15}
            />
            {touched.telefone && errors.telefone && <span className="text-xs text-red-500">{errors.telefone}</span>}
          </div>

          {/* Senha */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Senha</h3>
            
            <input
              name="senha"
              type="password"
              placeholder="Senha"
              className={`w-full bg-[#f8fafc] border ${touched.senha && errors.senha ? 'border-red-400' : 'border-[#e2e8f0]'} rounded-lg px-4 py-3 text-[14px] text-black placeholder-[#94a3b8] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition`}
              value={form.senha}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              minLength={8}
            />
            
            {/* Indicador de força da senha */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded bg-gray-200 overflow-hidden">
                <div className={`h-2 rounded transition-all duration-300 ${strengthColors[strength]} ${form.senha ? `w-${(strength+1)*2}/12` : 'w-0'}`}></div>
              </div>
              <span className="text-xs text-gray-400">{['Fraca', 'Fraca', 'Média', 'Boa', 'Forte'][strength]}</span>
            </div>
            {touched.senha && errors.senha && <span className="text-xs text-red-500">{errors.senha}</span>}
          </div>

          {/* Botão principal */}
          <button
            type="submit"
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 focus:ring-offset-2 disabled:opacity-60"
            disabled={loading || !isFormValid}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          {/* Footer */}
          <div className="flex items-center justify-center mt-8">
            <span className="text-sm text-[#2d3748]">
              Já tem conta?{' '}
              <a href="/login" className="text-[#3b82f6] font-semibold hover:underline">Fazer Login</a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
