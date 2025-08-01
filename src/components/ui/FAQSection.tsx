import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleQuestion } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "A Koplai é indicada para agências pequenas ou grandes?",
    answer: "A Koplai foi pensada para **todas as agências** — desde freelancers e estúdios enxutos até agências com dezenas de clientes. Nossa plataforma se adapta à sua operação, ajudando a escalar a produção sem aumentar o caos."
  },
  {
    question: "Como a Koplai ajuda na gestão de tarefas da equipe?",
    answer: "Com a funcionalidade de **organização de demandas**, você distribui tarefas, define prazos, acompanha status e garante que nada se perca. E com o **chat interno**, a comunicação flui direto na plataforma."
  },
  {
    question: "A IA cria conteúdo apenas para redes sociais?",
    answer: "Não. A IA da Koplai pode gerar **posts para redes sociais, roteiros de vídeo, ideias de reels, e-mails, textos para landing pages, anúncios e muito mais**. Tudo ajustado ao seu objetivo e público."
  },
  {
    question: "A ferramenta de agendamento funciona para quais redes sociais?",
    answer: "Atualmente, é possível agendar somente para o **Instagram**. O objetivo é que você consiga gerenciar **toda a rotina de posts em um só lugar**."
  },
  {
    question: "Posso criar vídeos e imagens com IA mesmo sem saber design?",
    answer: "Sim! Em beave com poucos cliques, você gera **criativos visuais de impacto**, com base no seu briefing e identidade visual. Ideal para quem quer ganhar tempo sem abrir mão da qualidade."
  },
  {
    question: "O que diferencia a Koplai de outras ferramentas de marketing e IA?",
    answer: "A Koplai **centraliza tudo**: criação com IA, agendamento, organização e comunicação interna. É uma plataforma feita especialmente para **quem vive de produzir conteúdo**, sem precisar de mil ferramentas separadas."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Toggle/Pill Button */}
          <span className="mb-8 px-3 py-2 rounded-full bg-[#5756f5] text-white text-lg font-regular tracking-tighter flex items-center justify-between gap-2">
          <span className="inline-block w-10 h-10 rounded-full bg-[#7977f7] border border-[#b7b6fa] flex items-center justify-center"><MessageCircleQuestion size={20}/></span>
          Dúvidas Frequentes
        </span>

          {/* Main Title */}
          <h2 className="text-5xl md:text-7xl font-regular text-black text-center mb-4 tracking-tighter">
            Perguntas Frequentes
          </h2>


          {/* FAQ Items */}
          <div className="w-full max-w-4xl space-y-4 mt-10">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-ease-in-out duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                >
                  <h3 className="text-lg font-medium text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <motion.div 
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ 
                        duration: 0.4,
                        ease: "easeInOut"
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 py-6 bg-gray-50 flex items-center">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer.split('**').map((part, i) => 
                            i % 2 === 1 ? (
                              <strong key={i} className="font-semibold">{part}</strong>
                            ) : (
                              part
                            )
                          )}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 