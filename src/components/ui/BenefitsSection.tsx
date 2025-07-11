import React from "react";
import { SquareKanban, Calendar, MessageCircle, Archive, Bot } from "lucide-react";

const benefits = [
  {
    title: "Kanban",
    description: "Organize tarefas, aprovações e fluxos de trabalho em colunas visuais",
    icon: <SquareKanban size={32} strokeWidth={1.5} />,
    highlight: true,
  },
  {
    title: "Agendamento de Posts",
    description: "Publique automaticamente em +5 redes sociais",
    icon: <Calendar size={32} strokeWidth={1.5} />,
  },
  {
    title: "Chat",
    description: "Converse com sua equipe dentro da Koplai",
    icon: <MessageCircle size={32} strokeWidth={1.5} />,
  },
  {
    title: "Armazene conteúdos",
    description: "Guarde os conteúdos para serem agendados ou postados",
    icon: <Archive size={32} strokeWidth={1.5} />,
  },
  {
    title: "Crie conteúdos com IA",
    description: "Faça os conteúdos completos com IA, ou use como ajudante",
    icon: <Bot size={32} strokeWidth={1.5} />,
  },
];

const BenefitsSection: React.FC = () => {
  return (
    <section
      className="w-full relative py-24 px-2 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 100% 100% at 50% 120%, rgba(99,91,255,1.0) 10%, #000623 70%)",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <span className="mb-6 px-6 py-2 rounded-full bg-[#635bff] bg-opacity-90 text-white text-base font-regualr tracking-tighter">Benefícios e Diferenciais</span>
        <h2 className="text-4xl md:text-5xl font-regular text-gray-100 text-center mb-2 tracking-tighter">Produza, Programe e Publique</h2>
        <p className="text-lg text-gray-400 text-center mb-12">Tudo em um lugar só</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Primeira linha: 3 cards */}
          {benefits.slice(0, 3).map((b, i) => (
            <div
              key={b.title}
              className={`relative rounded-xl border border-[#161a66] bg-[#000623] p-8 min-h-[200px] flex flex-col justify-start transition ease-in-out duration-300 hover:border-[#514ee4] group overflow-hidden`}
            >
              {/* Gradiente de hover */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition ease-in-out duration-300"
                style={{
                  background: "radial-gradient(ellipse 70% 100% at 100% 0%, #041882 0%, transparent 90%)"
                }}
              />
              <div className={`mb-6 flex items-center justify-center w-12 h-12 rounded-xl bg-[#5756f5] text-2xl transition ease-in-out duration-300 group-hover:drop-shadow-[0_0_12px_#5756f5]`}>
                {b.icon}
              </div>
              <h3 className="text-2xl font-regular text-white mb-2 tracking-tighter">{b.title}</h3>
              <p className="text-[#6b6d8e] text-base">{b.description}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-8">
          {/* Segunda linha: 2 cards */}
          {benefits.slice(3).map((b, i) => (
            <div
              key={b.title}
              className="relative rounded-xl border border-[#161a66] bg-[#000623] p-8 min-h-[200px] flex flex-col justify-start transition ease-in-out duration-300 hover:border-[#514ee4] group overflow-hidden"
            >
              {/* Gradiente de hover */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition ease-in-out duration-300"
                style={{
                  background: "radial-gradient(ellipse 70% 100% at 100% 0%, #041882 0%, transparent 90%)"
                }}
              />
              <div className="mb-6 flex items-center justify-center w-12 h-12 rounded-xl bg-[#5756f5]  text-white text-2xl transition ease-in-out duration-300 group-hover:drop-shadow-[0_0_16px_#5756f5] ">
                {b.icon}
              </div>
              <h3 className="text-2xl font-regular text-white mb-2 tracking-tighter
">{b.title}</h3>
              <p className="text-[#6b6d8e] text-base">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection; 