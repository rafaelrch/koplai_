import React from "react";

const testimonials = [
  {
    name: "Ana Souza",
    role: "Empreendedora Digital",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "A Koplai revolucionou minha produção de conteúdo. Consigo agendar posts e organizar tudo em um só lugar!",
  },
  {
    name: "Carlos Lima",
    role: "Social Media",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "A automação e os templates de IA me pouparam horas de trabalho. Recomendo para qualquer equipe de marketing!",
  },
  {
    name: "Juliana Alves",
    role: "Gestora de Conteúdo",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "O Kanban visual e o chat integrado facilitam muito a colaboração com meu time. Plataforma essencial!",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section
      className="w-full py-24 px-2 flex flex-col items-center justify-center relative"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 120%, #5756f5 0%, #000623 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <span className="mb-8 px-6 py-2 rounded-full bg-[#5756f5] text-white text-lg font-regular tracking-tighter flex items-center gap-2">
          Depoimentos
        </span>
        <h2 className="text-5xl md:text-7xl font-regular text-[#cbd0e4] text-center mb-20 tracking-tighter">Veja o que nossos clientes andam falando</h2>

        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl">
          {testimonials.map((t, i) => (
            <div key={i} className="relative rounded-2xl p-8 border border-[#23244a]  flex flex-col justify-between min-h-[320px] overflow-hidden">
              {/* Gradiente elíptico de fundo */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 50% 150% at 50% -20%,rgba(86, 86, 245, 0.19) 0%, #01051a 100%)",
                  opacity: 0.7,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10 flex flex-col h-full">
                <p className="text-md text-[#b5b7c7] mb-8  font-regular">“{t.text}”</p>
                <div className="flex items-center gap-4 mt-auto">
                  <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full bg-gray-300" />
                  <div>
                    <div className="font-bold text-white text-lg">{t.name}</div>
                    <div className="text-[#b5b7c7] text-sm">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 