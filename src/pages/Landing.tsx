import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSectionOne from '../components/ui/hero-section-demo-1';
import LandingBackground from '../components/ui/LandingBackground';
import { AnimatedCarousel } from '../components/ui/logo-carousel';
import BenefitsSection from "../components/ui/BenefitsSection";
import FastContentSection from "../components/ui/FastContentSection";
import HowItWorksSection from "../components/ui/HowItWorksSection";

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  // Features dinâmicas
  const features = [
    'Criação de roteiros de reels e mensagens personalizadas',
    'Criação e agendamento de posts direto na plataforma',
    'Gerenciamento de tarefas',
    'Chat interno para comunicação de equipe',
  ];
  const [activeFeature, setActiveFeature] = useState(0);

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
            <a href="#funcionalidades" className="text-gray-300 text-lg font-regular hover:text-white transition duration-200">Funcionalidades</a>
            <a href="#como-funciona" className="text-gray-300 text-lg font-regular hover:text-white transition duration-200">Como funciona</a>
            <a href="#depoimentos" className="text-gray-300 text-lg font-regular hover:text-white transition duration-200">Depoimentos</a>
            <a href="#precos" className="text-gray-300 text-lg font-regular hover:text-white transition duration-200">Preços</a>
          </div>
          {/* Botões */}
          <div className="flex gap-3">
            <Link to="/login">
              <button className="px-7 py-3 rounded-xl bg-white text-blue-700 font-regular text-lg hover:bg-blue-50 transition duration-200">Logar</button>
            </Link>
            <Link to="/cadastro">
              <button className="px-7 py-3 rounded-xl bg-[#635bff] text-white font-regular text-lg hover:bg-[#4f46e5] transition duration-200">Criar conta</button>
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <div ref={heroRef}>
        <HeroSectionOne />
      </div>
      {/* Slider de logos */}
      <AnimatedCarousel
        title="Quem confia em nós?"
        logos={[
          "https://cdn.worldvectorlogo.com/logos/react-2.svg",
          "https://cdn.worldvectorlogo.com/logos/next-js.svg",
          "https://cdn.worldvectorlogo.com/logos/vercel.svg",
          "https://cdn.worldvectorlogo.com/logos/typescript.svg",
          "https://cdn.worldvectorlogo.com/logos/tailwindcss.svg",
          "https://cdn.worldvectorlogo.com/logos/stripe-4.svg",
          "https://cdn.worldvectorlogo.com/logos/notion-2.svg",
          "https://cdn.worldvectorlogo.com/logos/github-icon-1.svg",
          "https://cdn.worldvectorlogo.com/logos/figma-icon-one-color.svg",
          "https://cdn.worldvectorlogo.com/logos/framer-motion.svg",
          "https://cdn.worldvectorlogo.com/logos/storybook-1.svg",
          "https://cdn.worldvectorlogo.com/logos/sanity.svg",
        ]}
        autoPlay={true}
        autoPlayInterval={3500}
        itemsPerViewMobile={3}
        itemsPerViewDesktop={6}
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
            <button className="mt-4 px-8 py-3 rounded-xl bg-blue-600 text-white font-regular text-base  hover:bg-blue-700 transition duration-200">Teste agora de graça</button>
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
    </div>
  );
} 