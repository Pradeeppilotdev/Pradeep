export default function AboutSection() {
  return (
    <div className="wrap" id="about">
      <div className="section-label">About</div>
      <div className="about">
        <p>
          Final-year CS engineering student and a <strong>GDG on Campus</strong> organizer. Most of what I build sits where <strong>zero-knowledge proofs</strong>, <strong>on-chain agents</strong>, and applied <strong>AI meet.</strong> I like systems where trust doesn&apos;t have to be taken on faith, it can be checked.
        </p>
        <p>
          I&apos;m actively seeking Web3 and AI engineering roles reaching out directly to teams building at the intersection of cryptography, agents, and infrastructure. I&apos;ve also got a merged PR into <strong>Leaflet.js</strong>.
        </p>
        <div className="stack-row">
          <span>Solidity</span><span>Circom</span><span>snarkjs</span><span>wagmi</span>
          <span>Mastra</span><span>TypeScript</span><span>React / Next.js</span><span>Java</span>
        </div>
      </div>
    </div>
  )
}
