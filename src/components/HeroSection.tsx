import {Button} from "./Button.tsx";
import '../styles/HeroSection.css';
import MobileSVG from '../assets/mobilemain.svg';
import '../App.css';

function HeroSection() {
    return(
        <div className='hero-container'>
            <video src='/videos/video_portada.mp4' autoPlay loop muted className="herosectionvideo"/>

            <div className="mx-auto max-w-7xl w-full [display:grid] grid-cols-6 gap-8 p-12">

            <div className="col-span-3 text-white p-4 my-20">
                <h1 className='text-8xl font-bold'>TraiScore</h1>
                <p className='text-5xl'>Registra tu entrenamiento y ofrece rutinas desde la palma de tu mano</p>
                    <div className='hero-btns'>
                        <Button className='btns' buttonStyle='btn--outline' buttonSize='btn--large'>
                            Descarga Aquí
                        </Button>

                        <Button className='btns' buttonStyle='btn--primary' buttonSize='btn--large'>
                            Presentación <i className='far fa-play-circle' />
                        </Button>
                    </div>
            </div>

                <div className="col-span-3">
                    <div style={{width: "380px", height: "590px"}}>
                        <img src={MobileSVG} style={{width: "100%", height: "100%"}} alt="Mobile mockup" />      
                    </div>
                </div>


            </div>
        </div>
    )
}

export default HeroSection;