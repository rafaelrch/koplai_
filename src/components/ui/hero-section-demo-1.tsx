"use client";

import { motion } from "framer-motion";
import { Cover } from "@/components/ui/cover";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export default function HeroSectionOne() {
  return (
    <div className="relative mx-auto mt-32 mb-10 flex w-full max-w-[1600px] flex-col items-center justify-center">
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-5xl text-center text-2xl font-regular text-white md:text-4xl lg:text-7xl dark:text-slate-300 tracking-tighter">
          <motion.span
            initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
            className="inline-block"
          >
            Crie conteúdo
          </motion.span>
          {' '}
          <motion.span
            initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.3, delay: 0.3, ease: "easeInOut" }}
            className="inline-block"
          >
            <Cover>10x mais rápido</Cover>
          </motion.span>
          {' '}
          <motion.span
            initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.3, delay: 0.5, ease: "easeInOut" }}
            className="inline-block"
          >
            e escale seu Marketing com IA
          </motion.span>
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-400 dark:text-neutral-400"
        >
          Acelere sua produção de conteúdo usando as principais ferramentas num só lugar, de forma profissional e sem custos elevados.
        </motion.p>

        <div className="flex justify-center mt-8">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-semibold text-lg px-16 py-3 shadow-lg"
          >
            Testar grátis
          </HoverBorderGradient>
        </div>

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
          className="relative z-10 mt-20 rounded-3xl border border-[#A4A6E7] bg-[#2B305E]/40 p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
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
    </div>
  );
} 