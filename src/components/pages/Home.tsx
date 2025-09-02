import '../../App.css'
import BenefitsSections from '../Fragments/BenefitsSections.tsx';
import SocialMediaSection from '../Fragments/SocialMediaSection.tsx';
import HeroSection from "../HeroSection.tsx";

function Home(){
    return (
        <>
            <HeroSection />
            <BenefitsSections/>
            <SocialMediaSection/>
        </>
    );
}

export default Home;