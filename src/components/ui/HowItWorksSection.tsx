import React from "react";

const HowItWorksSection: React.FC = () => {
  return (
    <section
      className="w-full min-h-[600px] py-24 px-2 flex flex-col items-center justify-center relative"
      style={{
        background:
          "radial-gradient(ellipse 100% 60% at 50% 0%, #5756f5 0%, #0a1033 60%, #000623 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <span className="mb-8 px-6 py-2 rounded-full bg-[#5756f5] text-white text-lg font-regular tracking-tighter flex items-center gap-2">
          Benefícios e Diferenciais
        </span>
        <h2 className="text-5xl md:text-6xl font-regular text-white text-center mb-4 tracking-tighter">Como funciona na prática?</h2>
        <p className="text-lg text-[#b7b6fa] text-center max-w-2xl font-regular mb-12">
          Assista esse vídeo rápido e descubra por dentro da plataforma e das nossas ferramentas.
        </p>
        <div className="w-full flex justify-center">
          <div className="w-full max-w-3xl h-[350px] md:h-[400px] bg-white rounded-2xl border-4 border-[#7977f7] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 0 4px #7977f733' }}>
            {/* Vídeo ou imagem aqui */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 