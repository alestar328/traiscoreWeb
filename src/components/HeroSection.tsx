import {Button} from "./Button.tsx";
import '../styles/HeroSection.css';
import MobileSVG from '../assets/mobilemain.svg';
import '../App.css';

function HeroSection() {
    return(
  <div className='hero-container'>
            <video src='/videos/video_portada.mp4' autoPlay loop muted className="herosectionvideo"/>

            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-8">

                <div className="lg:col-span-3 text-white p-2 lg:p-4 my-8 lg:my-20 flex flex-col justify-center text-center lg:text-left">
                    <h1 className='text-4xl sm:text-6xl lg:text-8xl font-bold leading-tight'>TraiScore</h1>
                    <p className='text-xl sm:text-3xl lg:text-5xl mt-4 lg:mt-6 leading-relaxed'>Registra tu entrenamiento y ofrece rutinas desde la palma de tu mano</p>
                    <div className='hero-btns flex flex-col sm:flex-row gap-4 mt-6 lg:mt-8 justify-center lg:justify-start'>
                            <img 
                                src="/src/assets/googleStoreEs.png" 
                                alt="Descargar en Google Play Store" 
                                className="cursor-pointer hover:scale-105 transition-transform duration-300 w-40 sm:w-48 h-12 sm:h-16 object-contain"
                            />
                            <img 
                                src="/src/assets/appleStoreEs.svg" 
                                alt="Descargar en Apple App Store" 
                                className="cursor-pointer hover:scale-105 transition-transform duration-300 w-40 sm:w-48 h-12 sm:h-16 object-contain"
                            />
                        </div>
                </div>

                    <div className="lg:col-span-3 flex items-center justify-center mt-8 lg:mt-0">
                        <div style={{width: "380px", height: "590px"}} className="w-64 h-80 sm:w-80 sm:h-96 flex items-center justify-center">
                            <img src={MobileSVG} className="w-full h-full object-contain" alt="Mobile mockup" />      
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default HeroSection;