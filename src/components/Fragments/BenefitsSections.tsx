import React from "react";

const benefits = [
  {
    title: "Registra tu Progreso",
    description:
      "Olvídate de perder tus entrenamientos. Registra cada repetición, serie y peso para un seguimiento preciso de tu evolución en el gimnasio.",
    icon: "📊",
    gradient: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/25"
  },
  {
    title: "Mide tu Transformación",
    description:
      "Toma medidas de brazos, pecho, cintura y más. Visualiza tu progreso corporal con gráficos claros y motivadores.",
    icon: "📏",
    gradient: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/25"
  },
  {
    title: "Sin Papel ni Libretas",
    description:
      "Dile adiós a las libretas que se pierden. Todo tu progreso está seguro en la nube, accesible desde cualquier dispositivo.",
    icon: "📱",
    gradient: "from-green-500 to-emerald-500",
    shadow: "shadow-green-500/25"
  },
];

function BenefitsSections() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            ¿Por qué elegir <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">TraiScore</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            La plataforma que simplifica la forma de entrenar y seguir tu progreso físico
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div 
              key={idx} 
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${benefit.gradient} p-8 text-white transform transition-all duration-500 hover:scale-105 hover:rotate-1 ${benefit.shadow} hover:shadow-2xl`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-12">
                  {benefit.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-200 transition-colors">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-100 leading-relaxed text-lg">
                  {benefit.description}
                </p>
                
                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-400 transition-all duration-500 group-hover:w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BenefitsSections;