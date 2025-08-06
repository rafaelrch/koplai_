import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.senha,
    });
    if (error) {
      setError('Email ou senha inválidos');
      setLoading(false);
      return;
    }
    // Login bem-sucedido: redireciona para a tela principal
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-white py-8 px-2">
      <div className="w-full max-w-[400px] bg-white rounded-2xl border border-[#e2e8f0] p-10 flex flex-col">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/koplai_logo.svg"
            alt="Logo Koplai"
            className="w-44 h-44 mb-6 object-contain"
          />
          <h1 className="text-[28px] font-semibold text-[#2d3748] mb-2 font-sans">Faça seu login!</h1>
        </div>

        {/* Toast de erro */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-center text-sm">
            ❌ {error}
          </div>
        )}

        {/* Formulário de login */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className=" text-black w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-3 text-[14px] placeholder-[#94a3b8] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          
          <input
            type="password"
            placeholder="Senha"
            className="text-black w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-3 text-[14px] placeholder-[#94a3b8] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition"
            value={form.senha}
            onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
            required
          />

          {/* Botão principal */}
          <button
            type="submit"
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 focus:ring-offset-2 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {/* Footer */}
          <div className="flex items-center justify-center mt-8">
            <span className="text-sm text-[#2d3748]">
              Não tem conta?{' '}
              <a href="/cadastro" className="text-[#3b82f6] font-semibold hover:underline">Criar conta</a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
} 