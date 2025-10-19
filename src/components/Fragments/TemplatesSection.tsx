import React from "react";
import templatesImage from '../../assets/templates.png';

function TemplatesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-5xl font-bold text-white mb-6">
              Todo lo que necesitas
            </h2>
            <h3 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-8">
              Para entrenar y no perder el tiempo
            </h3>
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Accede a plantillas de ejercicios profesionales, rutinas personalizadas y todo lo necesario para llevar tu entrenamiento al siguiente nivel.
            </p>
          </div>

          {/* Image Content */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <img 
                  src={templatesImage} 
                  alt="Templates de entrenamiento" 
                  className="w-full h-auto rounded-xl transform transition-transform duration-500 group-hover:scale-105"
                />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default TemplatesSection;
