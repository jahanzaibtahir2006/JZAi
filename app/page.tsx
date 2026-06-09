import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Testimonials from '@/components/Testimonials'
import Features from '@/components/features'
import Process from '@/components/Process'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <Testimonials />
      <Process />
      <FAQ />
      <Footer />
    </>
  )
}
