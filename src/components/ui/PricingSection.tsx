import React from "react";
import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";

const PricingSection: React.FC = () => {
  return (
    <section
      id="precos"
      className="w-full min-h-[600px] py-24 px-2 flex flex-col items-center justify-center relative"
      style={{
        background:
          "radial-gradient(ellipse 100% 60% at 50% 0%, #1e00ff 0%, #0a1033 60%, #000623 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <span className="mb-8 px-3 py-2 rounded-full bg-[#5756f5] text-white text-lg font-regular tracking-tighter flex items-center gap-2">
          <span className="inline-block w-10 h-10 rounded-full bg-[#7977f7] border border-[#b7b6fa] flex items-center justify-center"><PiggyBank size={20}/></span>
          Planos e Preços
        </span>
        <h2 className="text-5xl md:text-7xl font-regular text-white text-center mb-4 tracking-tighter">Traga sua operação para Koplai!</h2>
        <p className="text-xl text-[#b7b6fa] text-center max-w-2xl font-regular mb-12 tracking-tighter">
          Simplifique seu processo de criação e acelere sua produção de conteúdo!
        </p>
        
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
        >
          {/* Plano Starter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative z-10 rounded-3xl bg-[#000622] p-10 border border-[#161a66]"
          >
            <div className="text-start flex justify-between flex-col h-full">
                <div>
                <h3 className="text-2xl font-regular text-white mb-4">Starter</h3>
              <div className="text-6xl font-regular text-white mb-6">
                R$ 00
                <span className="text-lg text-[#a8a7a5] font-normal ml-1">/mês</span>
              </div>
              
              {/* Features */}
              <div className="text-left space-y-3 mb-8">
                <div className="flex items-center text-white text-sm">
                  <span className="text-green-400 mr-2">✓</span>
                  7 dias gratuitos
                </div>
                <div className="flex items-center text-white text-sm">
                  <span className="text-green-400 mr-2">✓</span>
                  Suporte
                </div>
              </div>
                </div>
              
              
              <button className="w-full py-4 px-6 rounded-xl bg-[#0b0061] text-white font-medium hover:bg-[#0f017b] transition duration-300">
                Teste já
              </button>
            </div>
          </motion.div>

          {/* Plano Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="relative z-10 rounded-3xl bg-[#1e00ff] p-10 shadow-[0_0_40px_#1e00ff] "
          >

            <div className="text-start">
              <h3 className="text-2xl font-regular text-white mb-4">Pro</h3>
              <div className="text-6xl font-regular text-white mb-6">
                R$ 97
                <span className="text-lg text-[#b2a8ff] font-normal ml-1">/mês</span>
              </div>
              
              {/* Features */}
              <div className="text-left space-y-3 mb-8">
                <div className="flex items-center text-white text-sm">
                  <span className="text-green-400 mr-2">✓</span>
                  Convidar usuários
                </div>
                <div className="flex items-center text-white text-sm">
                  <span className="text-green-400 mr-2">✓</span>
                  Criação de conteúdo com IA
                </div>
                <div className="flex items-center text-white text-sm">
                  <span className="text-green-400 mr-2">✓</span>
                  Histórico de criação de conteúdo
                </div>
                <div className="flex items-center text-white text-sm">
                  <span className="text-green-400 mr-2">✓</span>
                  Organização de demandas
                </div>
                <div className="flex items-center text-white text-sm">
                  <span className="text-green-400 mr-2">✓</span>
                  Agendar postagens
                </div>
                <div className="flex items-center text-white text-sm">
                  <span className="text-green-400 mr-2">✓</span>
                  Criação de videos e imagens com IA
                </div>
              </div>
              
              <button className="w-full text-[#1e00ff] py-4 px-6 rounded-xl bg-[#ffffff] font-regular text-lg  shadow-[0_0_14px_#ffffffcc] hover:shadow-[0_0_30px_#ffffffcc] hover:bg-[#eeeeee] transition duration-300">
                Começar agora
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection; 