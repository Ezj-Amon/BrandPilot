import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import PainPoints from '@/components/home/PainPoints'
import WorkflowIntro from '@/components/home/WorkflowIntro'

// 首页：组合 Header / Hero / PainPoints / WorkflowIntro / Footer
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <PainPoints />
        <WorkflowIntro />
      </main>
      <Footer />
    </div>
  )
}
