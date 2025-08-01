import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSectionOne from '../components/ui/hero-section-demo-1';
import LandingBackground from '../components/ui/LandingBackground';
import { AnimatedCarousel } from '../components/ui/logo-carousel';
import BenefitsSection from "../components/ui/BenefitsSection";
import FastContentSection from "../components/ui/FastContentSection";
import HowItWorksSection from "../components/ui/HowItWorksSection";
import TestimonialsSection from "../components/ui/TestimonialsSection";
import AllInOneSection from "../components/ui/AllInOneSection";
import PricingSection from "../components/ui/PricingSection";
import FAQSection from "../components/ui/FAQSection";
import Footer from "../components/ui/Footer";

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  
  // Features dinâmicas
  const features = [
    'Criação de roteiros de reels e mensagens personalizadas',
    'Criação e agendamento de posts direto na plataforma',
    'Gerenciamento de tarefas',
    'Chat interno para comunicação de equipe',
  ];
  const [activeFeature, setActiveFeature] = useState(0);

  // Função para scroll suave
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Função para abrir popup
  const handleJoinQueue = () => {
    setShowPopup(true);
  };

  // Função para fechar popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setEmail('');
  };

  // Função para enviar email
  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar o email
    console.log('Email enviado:', email);
    handleClosePopup();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const heroTop = heroRef.current.offsetTop;
      if (window.scrollY < heroTop) {
        window.scrollTo({ top: heroTop, behavior: 'instant' });
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!heroRef.current) return;
      const heroTop = heroRef.current.offsetTop;
      if (window.scrollY <= heroTop && e.touches[0].clientY > 0) {
        e.preventDefault();
        window.scrollTo({ top: heroTop, behavior: 'instant' });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    // Garante que ao montar, o scroll está no topo da hero
    if (heroRef.current) {
      window.scrollTo({ top: heroRef.current.offsetTop, behavior: 'instant' });
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Fechar popup com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPopup) {
        handleClosePopup();
      }
    };

    if (showPopup) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevenir scroll do body quando popup está aberto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showPopup]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center font-helvetica relative overflow-x-hidden bg-transparent">
      <LandingBackground />
      {/* Navbar flutuante */}
      <nav className="w-full flex justify-center mt-8 fixed top-0 left-0 z-50 bg-transparent">
        <div className="w-full max-w-7xl flex items-center justify-between px-8 py-4 rounded-xl border border-blue-700/50 bg-[#0a0e2a]/70 backdrop-blur-lg" style={{boxShadow: '0 2px 32px 0 rgba(0,0,0,0.10)'}}>
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/koplai-logo-branca.png" alt="Koplai AI Logo" className="h-10 w-auto max-w-[180px] object-contain" />
          </div>
          {/* Links */}
          <div className="flex-1 flex justify-center gap-8">
            <button 
              onClick={() => scrollToSection('funcionalidades')} 
              className="text-gray-300 text-lg font-regular hover:text-white transition duration-200 cursor-pointer"
            >
              Funcionalidades
            </button>
            <button 
              onClick={() => scrollToSection('como-funciona')} 
              className="text-gray-300 text-lg font-regular hover:text-white transition duration-200 cursor-pointer"
            >
              Como funciona
            </button>
            <button 
              onClick={() => scrollToSection('depoimentos')} 
              className="text-gray-300 text-lg font-regular hover:text-white transition duration-200 cursor-pointer"
            >
              Depoimentos
            </button>
            <button 
              onClick={() => scrollToSection('precos')} 
              className="text-gray-300 text-lg font-regular hover:text-white transition duration-200 cursor-pointer"
            >
              Preços
            </button>
          </div>
          {/* Botões */}
          <div className="flex gap-3">
            {/*<Link to="/login">
              <button className="px-7 py-3 rounded-xl bg-white text-blue-700 font-regular text-lg hover:bg-blue-50 transition duration-200">Logar</button>
            </Link>
            <Link to="/cadastro">
              <button className="px-7 py-3 rounded-xl bg-[#635bff] text-white font-regular text-lg hover:bg-[#4f46e5] transition duration-200">Criar conta</button>
            </Link> */}
            <button 
              onClick={handleJoinQueue}
              className="px-7 py-3 rounded-xl bg-[#006eff] text-white font-regular text-lg shadow-[0_0_14px_#006eff66] hover:shadow-[0_0_20px_#006eff99] transition duration-300"
            >
              Entrar na fila
            </button>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <div ref={heroRef}>
      <HeroSectionOne onJoinQueue={handleJoinQueue} />
      </div>
      {/* Slider de logos */}
      <AnimatedCarousel
        title="Quem confia em nós?"
        logos={[
          "/zebrain.png",
          "/sunlux.png",
          "/nuavo.png",
          "/neuron.png",
          "/okto.png",
          "/Blue.png",
          "/slidely.png",
          "/myartist.png",
        ]}
        autoPlay={true}
        autoPlayInterval={3500}
        itemsPerViewMobile={2}
        itemsPerViewDesktop={4}
        logoContainerWidth="w-32"
        logoContainerHeight="h-16"
        logoImageWidth="w-auto"
        logoImageHeight="h-10"
      />
      {/* Seção de aceleradores de crescimento */}
      <section className="w-full bg-white py-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 px-4 items-start">
          {/* Coluna esquerda: textos e lista */}
          <div className="flex-1 min-w-[320px]">
            <span className="inline-block border border-blue-500 text-blue-600 text-xs font-semibold rounded-md px-4 py-1 mb-6 tracking-tight bg-white/80">IMPULSIONE O SEU NEGÓCIO</span>
            <h2 className="text-4xl md:text-6xl font-regular text-black leading-tight mb-6">Aceleradores de<br />crescimento</h2>
            <p className="text-xl text-gray-400 font-regular mb-10 max-w-2xl">Somos a primeira plataforma a reunir todas as ferramentas necessárias para a criação de conteúdo:</p>
            {/* Lista de features dinâmica */}
            <ul className="space-y-6 mb-10">
              {features.map((feature, idx) => (
                <li
                  key={feature}
                  className="flex items-center cursor-pointer group"
                  onClick={() => setActiveFeature(idx)}
                >
                  <span
                    className={
                      `w-1 h-8 rounded-full mr-4 transition-all transition-colors duration-300 ease-in-out ` +
                      (activeFeature === idx ? 'bg-blue-500' : 'bg-gray-200')
                    }
                  />
                  <span
                    className={
                      `text-lg transition-all transition-colors transition-font duration-300 ease-in-out ` +
                      (activeFeature === idx
                        ? 'font-semibold text-black'
                        : 'text-gray-300')
                    }
                  >
                    {feature}
                  </span>
              </li>
              ))}
            </ul>
            <button 
              onClick={handleJoinQueue}
              className="mt-4 px-8 py-3 rounded-xl bg-blue-600 text-white font-regular text-base hover:bg-blue-700 transition duration-200"
            >
              Entrar na fila de espera
            </button>
          </div>
          {/* Coluna direita: card placeholder */}
          <div className="flex-1 min-w-[320px] flex items-center justify-center">
            <div className="w-full h-[400px] bg-gray-100 rounded-3xl" />
          </div>
        </div>
      </section>
      <BenefitsSection />
      <FastContentSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <AllInOneSection />
      <PricingSection />
      <FAQSection />
      <Footer/>
      
      {/* Popup de Email */}
      {showPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClosePopup}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h3 className="text-2xl font-regular text-gray-900 mb-4">
                Insira seu email para ser um dos primeiros a utilizar
              </h3>
              
              <form onSubmit={handleSubmitEmail} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClosePopup}
                    className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 