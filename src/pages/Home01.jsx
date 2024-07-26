import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import heroSliderData from '../assets/fake-data/data-slider';
import Slider from '../components/slider/Slider';


const Home01 = () => {

    return (
        <div className='home-1'>
            <Header />
            <Slider data={heroSliderData} />
            <Footer />
        </div>
    );
}

export default Home01;
