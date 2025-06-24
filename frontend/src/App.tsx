
import Header from './components/Header';
import Hero from './components/hero';
import HowItWorks from './components/howitworks';
import SkillShowcase from './components/skillShowcase';
import SuccessStories from './components/successStories';
import Footer from './components/Footer';


function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <HowItWorks />
      <SkillShowcase />
      <SuccessStories />
      <Footer />
    </div>
  );
}

export default App;