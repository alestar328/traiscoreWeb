import SocialMediaSVG from "../../assets/socialMedia.svg";

function SocialMediaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE - TEXT CONTENT */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-white leading-tight">
                Comparte tu{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Progreso
                </span>
              </h2>
              <p className="text-2xl text-gray-300 leading-relaxed max-w-lg">
                Celebra tus logros y motiva a otros con filtros especiales que destacan tu mejor rendimiento.
              </p>
            </div>

            {/* FEATURES */}
            <div className="space-y-6">
              {[
                { icon: "🏆", title: "Filtro de Peso Máximo", text: "Destaca el ejercicio donde levantas más peso con un filtro que resalta tu fuerza." },
                { icon: "🔥", title: "Filtro de Repeticiones", text: "Muestra el ejercicio donde completas más repeticiones, demostrando tu resistencia." },
                { icon: "📸", title: "Foto Personalizada", text: "Toma una foto con tu cámara y aplica filtros que muestren tus estadísticas destacadas." },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#111315] border border-cyan-700/30 rounded-xl flex items-center justify-center group-hover:border-cyan-400 transition-all duration-300">
                    <span className="text-2xl text-cyan-400">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA BUTTON 
            <div className="pt-6">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-cyan-400/30 hover:shadow-xl">
                <span className="relative z-10">Empezar a compartir</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>*/}
          </div>

          {/* RIGHT SIDE - MOCKUP WITH GLOW */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Halo glow (same as TemplatesSection) */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-1000"></div>

              {/* Image */}
              <img
                src={SocialMediaSVG}
                alt="Mobile mockup"
                className="relative w-[380px] h-[590px] rounded-2xl transform transition-transform duration-500 group-hover:scale-105"
              />

              {/* Floating Icons */}
              <div className="absolute -top-4 -right-4 w-14 h-14 bg-[#111315] border border-cyan-600/30 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl text-cyan-400">📊</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-[#111315] border border-cyan-600/30 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-lg text-cyan-400">🔥</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SocialMediaSection;
