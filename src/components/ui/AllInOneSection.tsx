import React from 'react';
import { Key } from "lucide-react";

export default function AllInOneSection() {
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Toggle/Pill Button */}
          <span className="mb-8 px-3 py-2 rounded-full bg-[#5756f5] text-white text-lg font-regular tracking-tighter flex items-center justify-between gap-2">
          <span className="inline-block w-10 h-10 rounded-full bg-[#7977f7] border border-[#b7b6fa] flex items-center justify-center"><Key size={20}/></span>
          O segredo
        </span>

          {/* Main Title */}
          <h2 className="text-5xl md:text-7xl font-regular text-black text-center mb-4 tracking-tighter">Tudo em um lugar só</h2>

          {/* Subtitle */}
          <p className="text-xl text-[#8b89b6] text-center max-w-xl font-regular">
          A única plataforma que faz tudo o que você precisa
        </p>

          {/* Image */}
          <div className="w-full max-w-7xl rounded-3xl overflow-hidden mt-10">
            <img 
              src="/comparacaoKoplai.png" 
              alt="Comparação Koplai - Tudo em um só lugar" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 