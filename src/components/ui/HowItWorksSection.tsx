import React from "react";
import { motion } from "framer-motion";

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
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className=" relative z-10 mt-10 rounded-3xl border border-[#A4A6E7] bg-[#2B305E]/40 p-5  dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300/50 dark:border-gray-700">
            <img
              src="https://assets.aceternity.com/pro/aceternity-landing.webp"
              alt="Landing page preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 