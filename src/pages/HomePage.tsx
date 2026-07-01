import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import PainPoints from '@/components/home/PainPoints'
import Differentiators from '@/components/home/Differentiators'
import WorkflowIntro from '@/components/home/WorkflowIntro'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <PainPoints />
        <Differentiators />
        <WorkflowIntro />
      </main>
      <Footer />
    </div>
  )
}
