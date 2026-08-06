import ShinyText from '@/components/ShinyText'

export default function ContactSection() {
  return (
    <div className="wrap" id="contact">
      <div className="section-label"><ShinyText text="Contact" speed={2.5} color="var(--muted)" shineColor="var(--ink)" /></div>
      <div className="contact">
        <span className="mask"><span className="mask-inner"><a className="contact-big" href="mailto:chandrapradeepr@gmail.com">chandrapradeepr@gmail.com</a></span></span>
        <p className="contact-sub">Open to AI / Blockchain engineering roles — remote or anywhere in India.</p>
        <div className="contact-socials">
          <a href="https://github.com/Pradeeppilotdev" target="_blank" rel="noopener">GitHub ↗</a>
          <a href="https://x.com/pradeeppilot2k5" target="_blank" rel="noopener">X ↗</a>
          <a href="https://t.me/pradeeppilot" target="_blank" rel="noopener">Telegram ↗</a>
        </div>
        <div className="footer-note">
          <span>© 2026 Chandrapradeep N.</span>
        </div>
      </div>
    </div>
  )
}
