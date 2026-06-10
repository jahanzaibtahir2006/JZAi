import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/features'
import { Process } from '@/components/Process'
import { Marquee } from '@/components/Marquee'
import { Testimonials } from '@/components/Testimonials'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      {/* Animated background orbs — persists across sections */}
      <div className="bg-mesh" aria-hidden />

      <Navbar />

      <main>
        <Hero />
        <Marquee />
        <Features />
        <Process />
        <Testimonials />
        <FAQ />
      </main>

      <Footer />
    </>
  )
}
