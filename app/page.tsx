import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Services from '@/components/Services'
import Process from '@/components/Process'
import TechStack from '@/components/TechStack'
import WhyUs from '@/components/WhyUs'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Process />
      <TechStack />
      <WhyUs />
      <FAQ /> 
      <CTA />
      <Footer />
    </>
  )
}
