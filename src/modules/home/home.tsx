import Header from "@/shared/widgets/header/header";
import Branding from "@/modules/home/elements/branding";
import Benefits from "@/modules/home/elements/benefits";
import Pricing from "@/modules/home/elements/pricing";
import { Banner } from "./elements/banner";
import { About } from "./elements/about";
import { FeatureHighlight } from "./elements/feature.highlight";
import { FAQ } from "./elements/faq";
import { XFooter } from "@/shared/widgets/footer/footer";



const Home = () => {
  return (
    <div>
      <Header />
      <Banner />
      <About/>
      {/* <Branding /> */}
      {/* <Benefits /> */}
      <FeatureHighlight />
      <FAQ/>
      <Pricing />
      <XFooter />
    </div>
  );
};

export default Home;
