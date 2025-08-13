import React from 'react';
import { Mail, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer 
      className="w-full py-16"
      style={{
        background: "radial-gradient(ellipse 100% 80% at 50% 110%,rgb(30, 0, 255) 0%, #0a1033 60%, #000623 100%)"
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left side - Logo and description */}
          <div className="flex flex-col items-start">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/koplai-logo-branca.png" 
                alt="Koplai Logo" 
                className="h-8 w-auto object-contain"
              />
            </div>
            
                        {/* Description */}
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-4">
             Conecte-se com a gente!
            </p>
            
            {/* Instagram Icon */}
            <a 
              href="https://www.instagram.com/koplai.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#000622] hover-bg[#00105c] border border-[#3c3c3c] transition-all duration-200"
            >
              <Instagram className="w-5 h-5 text-white" />
            </    a>
          </div>

          {/* Right side - Contact and navigation */}
          <div className="flex flex-col items-start gap-6">
            {/* Contact email */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50">
              <Mail className="w-4 h-4 text-white" />
              <span className="text-white text-sm">contato@koplai.com.br</span>
            </div>

            {/* Navigation links */}
            <div className="flex flex-wrap gap-6">
              <a href="#sobre" className="text-white text-sm hover:text-gray-300 transition-colors duration-200">
                Sobre
              </a>
              <a href="#funcionalidades" className="text-white text-sm hover:text-gray-300 transition-colors duration-200">
                Funcionalidades
              </a>
              <a href="#precos" className="text-white text-sm hover:text-gray-300 transition-colors duration-200">
                Preços
              </a>
              <a href="#contato" className="text-white text-sm hover:text-gray-300 transition-colors duration-200">
                Contato
              </a>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Koplai. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <a href="/privacidade" className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                Política de Privacidade
              </a>
              <a href="/termos" className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 