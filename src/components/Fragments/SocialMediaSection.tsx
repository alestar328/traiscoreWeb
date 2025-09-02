import React from "react";
import SocialMediaSVG from '../../assets/socialMedia.svg';

function SocialMediaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-white leading-tight">
                Comparte tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Progreso</span>
              </h2>
              <p className="text-2xl text-gray-300 leading-relaxed">
                Celebra tus logros y motiva a otros con filtros especiales que destacan tu mejor rendimiento
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Filtro de Peso Máximo</h3>
                  <p className="text-gray-300">Destaca el ejercicio donde levantas más peso con un filtro especial que resalta tu fuerza</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Filtro de Repeticiones</h3>
                  <p className="text-gray-300">Muestra el ejercicio donde completas más repeticiones, demostrando tu resistencia</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📸</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Foto Personalizada</h3>
                  <p className="text-gray-300">Toma una foto con tu cámara y aplica filtros que muestren tus estadísticas destacadas</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25">
                <span className="relative z-10">Empezar a Compartir</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Right Side - Mobile Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone Frame */}
            

                    <div style={{width: "380px", height: "590px"}}>
                        <img src={SocialMediaSVG} style={{width: "100%", height: "100%"}} alt="Mobile mockup" />      
                    </div>




              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-2xl">📊</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-xl">🔥</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SocialMediaSection;