import Hero from '@/components/Hero'
import CommitSection from '@/components/CommitSection'
import WorkSection from '@/components/WorkSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'

export default function Home() {
  return (
    <>
      <Hero />
      <CommitSection />
      <WorkSection />
      <AboutSection />
      <ContactSection />
    </>
  )
}