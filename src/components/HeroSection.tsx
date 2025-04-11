import {Button} from "./Button.tsx";
import '../styles/HeroSection.css';
import '../App.css';

function HeroSection() {
    return(
        <div className='hero-container'>
            <video src='/videos/video_portada.mp4' autoPlay loop muted/>
            <h1>TraiScore</h1>
            <p>Registra tu entrenamiento y ofrece rutinas desde la palma de tu mano</p>
            <div className='hero-btns'>
                <Button
                        className='btns'
                        buttonStyle='btn--outline'
                        buttonSize='btn--large'>
                    Descarga Aquí
                </Button>

                <Button
                    className='btns'
                    buttonStyle='btn--primary'
                    buttonSize='btn--large'>
                    Presentación <i className='far fa-play-circle' />
                </Button>
            </div>
        </div>
    )
}

export default HeroSection;