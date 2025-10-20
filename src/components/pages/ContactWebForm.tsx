import contactPic from "../../assets/register_mainpic.png";

const ContactWebForm = () => {
  return (
    <section className="flex justify-center items-center bg-gradient-to-r from-cyan-900 via-blue-900 to-black py-12 lg:py-14 px-4 min-h-[75vh]">
      <div className="w-full max-w-3xl mx-auto flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">

        {/* FORMULARIO */}
        <div className="w-full lg:w-1/2 bg-[#111315] px-5 sm:px-6 py-8 flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 text-center lg:text-left">
            Get in touch with us
          </h2>
          <p className="text-gray-400 mb-6 text-center lg:text-left text-xs sm:text-sm">
            Hi, I'm Amanda. Need help? Use the form below or email us at
            <span className="text-cyan-400"> help@traiscore.io</span>
          </p>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-2 text-xs sm:text-sm">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your full name"
                className="w-full bg-[#1a1c1e] text-gray-100 p-2.5 rounded-lg border border-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-300 mb-2 text-xs sm:text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="w-full bg-[#1a1c1e] text-gray-100 p-2.5 rounded-lg border border-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-gray-300 mb-2 text-xs sm:text-sm">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                placeholder="Type your message here..."
                className="w-full bg-[#1a1c1e] text-gray-100 p-2.5 rounded-lg border border-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500 text-sm resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-400 text-black font-semibold py-2.5 
                         rounded-lg transition-all duration-300 hover:shadow-cyan-400/40 hover:shadow-lg text-sm"
            >
              Send my message
            </button>
          </form>
        </div>

        {/* IMAGEN */}
        <div className="w-full lg:w-1/2 h-48 sm:h-64 lg:h-auto bg-[#0d0f11]">
          <img
            src={contactPic}
            alt="Contact visualization"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactWebForm;
