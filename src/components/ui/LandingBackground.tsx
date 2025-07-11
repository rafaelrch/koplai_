import React from "react";
import Particles from "./Particles";

/**
 * Background customizado para landing page:
 * - Gradiente radial azul/violeta
 * - Partículas animadas (substitui as linhas SVG)
 * - Máscara radial para suavizar bordas
 */
const LandingBackground: React.FC = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Gradiente radial */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            "radial-gradient(ellipse 100%100% at 50% 80%, rgba(99,91,255,1.0) 40%, #000623 70%)",
          opacity: 1,
        }}
      />
      {/* Partículas animadas */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={800}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      {/* Máscara radial para suavizar bordas */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 50% 50% at 50% 0%, white 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 50% 50% at 50% 0%, white 60%, transparent 100%)",
        }}
      />
    </div>
  );
};

export default LandingBackground; 