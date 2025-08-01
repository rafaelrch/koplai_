import React from "react";
import { Plus } from "lucide-react";

const FastContentSection: React.FC = () => {
  return (
    <section className="w-full bg-[#f6f8fb] py-24 px-2">
      <div className="max-w-4xl mx-auto flex flex-col items-center ">
        <span className="mb-8 px-3 py-2 rounded-full bg-[#5756f5] text-white text-lg font-regular tracking-tighter flex items-center justify-between gap-2">
          <span className="inline-block w-10 h-10 rounded-full bg-[#7977f7] border border-[#b7b6fa] flex items-center justify-center"><Plus size={20}/></span>
          Fácil de criar conteúdo
        </span>
        <h2 className="text-5xl md:text-6xl font-regular text-black text-center mb-4 tracking-tighter">Crie conteúdos em segundos</h2>
        <p className="text-lg text-[#8b89b6] text-center max-w-xl font-regular">
          Economize horas de trabalho com mais de 20 templates prontos,<br />
          use agentes de IA que criam conteúdo com um comando.
        </p>
        {/* Imagem/ilustração abaixo dos textos */}
        <div className="mt-12 flex justify-center w-full">
          <div className="w-full max-w-2xl h-64 bg-[#e5e7ef] rounded-2xl flex items-center justify-center text-[#b7b6fa] text-xl font-regular border-2 border-dashed border-[#b7b6fa]">
            Imagem ou ilustração aqui
          </div>
        </div>
      </div>
    </section>
  );
};

export default FastContentSection; 