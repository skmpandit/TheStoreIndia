import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';
import slider1 from "../assets/images/slider-1.png"
import slider2 from "../assets/images/slider-2.png"
 
const AutoplaySlider = withAutoplay(AwesomeSlider);

const Slider = () => (
  <section>
    <div>
      <AutoplaySlider
        play={true}
        cancelOnInteraction={false} // should stop playing on user interaction
        interval={6000}
      >
          <div data-src={slider1} />
          <div data-src={slider2} />
      </AutoplaySlider>
    </div>
  </section>
);

export default Slider;