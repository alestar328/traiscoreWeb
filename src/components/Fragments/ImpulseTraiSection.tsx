const plans = [
  {
    name: "Pro - Mensual",
    price: "2,99 € + IVA",
    description:
      "La solución perfecta para atletas que buscan progresar sin límites. Entrena, mide y evoluciona con acceso total.",
    tag: "Recomendado",
    note: "1 mes gratis sin permanencia",
    highlighted: true,
  },
  {
    name: "Pro - Anual",
    price: "29,99 € + IVA / año",
    description:
      "Ahorra con el pago anual y obtén todos los beneficios del plan Unlimited por adelantado.",
    note: "Pago inmediato • Tarjeta • Google Pay • Apple Pay",
    highlighted: false,
  },
];

function ImpulseTraiSection() {
  return (
    <section className="py-24 bg-[#0f1113] text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-5xl font-bold mb-4">
          Impulsa tu progreso con el{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            plan ideal
          </span>
        </h2>
        <p className="text-gray-400 text-lg mb-16">
          Elige el plan que mejor se adapte a tu evolución.
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl border ${
                plan.highlighted
                  ? "bg-[#17191b] border-cyan-400/30 shadow-cyan-400/20 shadow-lg"
                  : "bg-[#151719] border-gray-700/50"
              } p-10 flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02]`}
            >
              {/* Recommended Tag */}
              {plan.tag && (
                <span className="absolute top-4 right-4 text-xs font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 text-black px-3 py-1 rounded-full">
                  {plan.tag}
                </span>
              )}

              {/* Title */}
              <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>

              {/* Description */}
              <p className="text-gray-400 mb-8 leading-relaxed">
                {plan.description}
              </p>

              {/* Price */}
              <div>
                <p className="text-4xl font-bold mb-2 text-cyan-400">
                  {plan.price}
                </p>
                <p className="text-sm text-gray-500 mb-6">{plan.note}</p>
              </div>

              {/* Button */}
              <button
                className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-cyan-400 to-blue-400 text-black hover:shadow-cyan-400/30 hover:shadow-xl"
                    : "bg-transparent border border-gray-600 hover:border-cyan-400 hover:text-cyan-300"
                }`}
              >
               Adquiérela en la App Store →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpulseTraiSection;