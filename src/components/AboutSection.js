export default function AboutSection() {
  return (
    <div className="wrap" id="about">
      <div className="section-label">About</div>
      <div className="about">
        <p>
          I&apos;m Chandrapradeep R, a final-year CS engineering student and a <strong>GDG on Campus</strong> organizer. Most of what I build sits where <strong>zero-knowledge proofs</strong>, <strong>on-chain agents</strong>, and applied <strong>AI</strong> meet — systems where trust doesn&apos;t have to be taken on faith, it can be checked.
        </p>
        <p>
          That throughline started with detection systems that had to prove their own findings — GhostNet tracing wallet coordination, ProofAlpha anchoring evidence on-chain instead of just asserting it — and led to ArcZK, where the verification isn&apos;t a side feature anymore, it&apos;s the entire settlement mechanism.
        </p>
        <p>
          I&apos;ve shipped across five hackathons in the last year and picked up a merged pull request into <strong>Leaflet.js</strong>. I&apos;m reaching out directly to teams building at the intersection of cryptography, agents, and infrastructure — because that&apos;s the work I actually want to be doing.
        </p>
        <div className="about-stats">
          <div><strong>6</strong><span>shipped projects</span></div>
          <div><strong>5</strong><span>hackathons</span></div>
          <div><strong>1</strong><span>merged OSS PR</span></div>
        </div>
        <div className="stack-row">
          <span>Solidity</span><span>Circom</span><span>snarkjs</span><span>wagmi</span>
          <span>Mastra</span><span>TypeScript</span><span>React / Next.js</span><span>Java</span>
        </div>
      </div>
    </div>
  )
}
