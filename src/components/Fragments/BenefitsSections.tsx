import React from "react";
import { FaChartLine, FaRuler, FaCloud } from "react-icons/fa";

const benefits = [
  {
    title: "Registra tu progreso",
    description:
      "Registra cada repetición, serie y peso para un seguimiento preciso de tu evolución en el gimnasio.",
    icon: <FaChartLine className="text-4xl text-gray-300" />,
    metric: "+45%",
    label: "Crecimiento en 6 meses",
  },
  {
    title: "Mide tu transformación",
    description:
      "Visualiza tu progreso corporal con métricas claras, motivadoras y fáciles de interpretar.",
    icon: <FaRuler className="text-4xl text-gray-300" />,
    metric: "90%",
    label: "Retención de clientes",
  },
  {
    title: "Sin papel ni libretas",
    description:
      "Asegura tus datos en la nube y accede desde cualquier dispositivo, sin riesgo de pérdida.",
    icon: <FaCloud className="text-4xl text-gray-300" />,
    metric: "99%",
    label: "Datos sincronizados",
  },
];

function BenefitsSections() {
  return (
    <section className="py-24 bg-[#0f0f10] text-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Título principal */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-100">
            Tres razones para elegir{" "}
            <span className="text-white">TraiScore</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Entrena con propósito, mide tu progreso y crece con datos reales.
          </p>
        </div>

        {/* Grid de beneficios */}
        <div className="grid md:grid-cols-3 gap-12">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center space-y-6 bg-[#1a1b1d] rounded-2xl p-10 transition-transform duration-300 hover:scale-[1.02] hover:bg-[#202123]"
            >
              {/* Ícono */}
              <div className="p-4 rounded-full bg-[#2a2b2d] flex items-center justify-center">
                {benefit.icon}
              </div>

              {/* Texto */}
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-100">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {/* Métrica inferior */}
              <div className="pt-4 border-t border-gray-700 w-full">
                <p className="text-sm text-gray-500">{benefit.label}</p>
                <p className="text-2xl font-bold text-gray-200">
                  {benefit.metric}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BenefitsSections;
