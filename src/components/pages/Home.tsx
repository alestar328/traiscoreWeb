import '../../App.css'
import BenefitsSections from '../Fragments/BenefitsSections.tsx';
import ImpulseTraiSection from '../Fragments/ImpulseTraiSection.tsx';
import SocialMediaSection from '../Fragments/SocialMediaSection.tsx';
import TemplatesSection from '../Fragments/TemplatesSection.tsx';
import HeroSection from "../HeroSection.tsx";

function Home(){
    return (
        <>
            <HeroSection />
            <BenefitsSections/>

            <SocialMediaSection/>

            <ImpulseTraiSection/>
            <TemplatesSection/>
        </>
    );
}

export default Home;