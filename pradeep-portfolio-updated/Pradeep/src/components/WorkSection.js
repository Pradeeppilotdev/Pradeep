'use client'

import { useRef, useCallback } from 'react'
import gsap from 'gsap'

const projects = [
  {
    index: '01',
    name: 'ArcZK',
    context: 'Live · Arc testnet',
    isLive: true,
    desc: "A ZK-gated USDC escrow protocol on Circle's Arc testnet. Work is verified with a Groth16 proof before funds settle — no trusted third party checking the output.",
    highlight: '4 Solidity contracts + a Circom circuit with Poseidon hashing, proved entirely in-browser via snarkjs.',
    tags: ['Solidity', 'Circom / ZK-SNARKs', 'snarkjs', 'React · wagmi'],
    links: [
      { label: 'Live app', url: 'https://arczk.vercel.app' },
      { label: 'Source', url: 'https://github.com/Pradeeppilotdev/ArcProof' },
    ],
  },
  {
    index: '02',
    name: 'ProofAlpha',
    context: '0G APAC Hackathon',
    desc: 'A verifiable on-chain wallet-coordination detector. Evidence bundles are stored on 0G Storage and coordination proofs are submitted on-chain, so a fraud claim is checkable, not just an opinion.',
    highlight: 'Deployed CoordinationRegistry.sol on 0G Galileo testnet; 300+ testnet proofs combining real Storage uploads with on-chain submissions.',
    tags: ['Solidity', '0G Storage', 'BFS traversal'],
    links: [],
  },
  {
    index: '03',
    name: 'GhostNet',
    context: '2nd place · Nansen CLI',
    desc: 'A cross-market smart-money coordination detector — traces wallet clusters moving in sync across Hyperliquid perps, then pushes real-time alerts to Telegram.',
    tags: ['Hyperliquid API', 'Nansen labels', 'Telegram bot'],
    links: [
      { label: 'Live app', url: 'https://ghostnetai.xyz' },
      { label: 'Source', url: 'https://github.com/Pradeeppilotdev/HackoBot' },
    ],
  },
  {
    index: '04',
    name: 'ChainGuard',
    context: 'Cognizant Technoverse',
    desc: 'A pre-settlement UPI fraud risk scorer. An Investigator agent and an Analyst agent run every transaction through five weighted rules before it settles, not after.',
    tags: ['Mastra multi-agent', 'TypeScript', 'Groq / Llama 3.3'],
    links: [
      { label: 'Source', url: 'https://github.com/Pradeeppilotdev/ChainGuard' },
    ],
  },
  {
    index: '05',
    name: 'Agent Bounty Board',
    context: 'Monad Blitz Bangalore',
    desc: 'Agents post, claim, complete, and get paid for bounties on their own using the x402 payment protocol, with on-chain proof of completion — no human in the loop for settlement.',
    tags: ['x402 protocol', 'Autonomous agents'],
    links: [],
  },
  {
    index: '06',
    name: 'One-Tap Deployer',
    context: 'Side project · Base',
    desc: 'Deploy a smart contract to Base in a single tap, then track its wallet health from the same dashboard — built to strip friction out of shipping on-chain.',
    tags: ['Base (L2)', 'Solidity'],
    links: [
      { label: 'Live app', url: 'https://base-one-tap-contract-deployer.vercel.app' },
    ],
  },
]

const FEATURED_COUNT = 3

function ProjectLinks({ links }) {
  if (links.length > 0) {
    return (
      <div className="work-links">
        {links.map(link => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener">{link.label}</a>
        ))}
      </div>
    )
  }
  return <div className="work-links work-links-pending">Write-up coming soon</div>
}

function FeaturedCard({ p }) {
  return (
    <div className="feat-card">
      <div className="feat-card-top">
        <span className="feat-index">{p.index}</span>
        <span className={`work-context${p.isLive ? ' work-status live' : ''}`}>
          {p.isLive && <span className="dot"></span>}
          {p.context}
        </span>
      </div>
      <h3 className="feat-name">{p.name}</h3>
      <p className="work-desc">{p.desc}</p>
      {p.highlight && <div className="work-highlight">{p.highlight}</div>}
      <div className="work-tags">
        {p.tags.map(tag => <span key={tag}>{tag}</span>)}
      </div>
      <ProjectLinks links={p.links} />
    </div>
  )
}

export default function WorkSection() {
  const featured = projects.slice(0, FEATURED_COUNT)
  const rest = projects.slice(FEATURED_COUNT)
  const itemsRef = useRef([])

  const toggleAccordion = useCallback((index) => {
    const item = itemsRef.current[index]
    if (!item) return
    const body = item.querySelector('.work-body')
    const inner = item.querySelector('.work-body-inner')
    const btn = item.querySelector('.work-head')
    const isOpen = item.classList.contains('expanded')

    itemsRef.current.forEach((otherItem, i) => {
      if (i !== index && otherItem?.classList.contains('expanded')) {
        otherItem.classList.remove('expanded')
        otherItem.querySelector('.work-head').setAttribute('aria-expanded', 'false')
        const b = otherItem.querySelector('.work-body')
        gsap.to(b, { height: 0, duration: 0.4, ease: 'power3.inOut' })
      }
    })

    item.classList.toggle('expanded', !isOpen)
    btn.setAttribute('aria-expanded', String(!isOpen))

    if (!isOpen) {
      gsap.set(body, { height: 'auto' })
      const h = body.offsetHeight
      gsap.fromTo(body, { height: 0 }, { height: h, duration: 0.5, ease: 'power3.inOut' })
      gsap.fromTo(
        inner.querySelectorAll('.work-desc, .work-highlight, .work-tags, .work-links'),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out', delay: 0.2 }
      )
    } else {
      gsap.to(body, { height: 0, duration: 0.35, ease: 'power3.inOut' })
    }
  }, [])

  return (
    <div className="wrap" id="work">
      <div className="section-label">Work</div>

      <div className="feat-grid">
        {featured.map(p => <FeaturedCard key={p.index} p={p} />)}
      </div>

      <div className="section-label secondary">More builds</div>
      <div className="work-list">
        {rest.map((p, i) => (
          <div className="work-item" key={p.index} ref={el => itemsRef.current[i] = el}>
            <button
              className="work-head"
              aria-expanded="false"
              onClick={() => toggleAccordion(i)}
            >
              <span className="work-index">{p.index}</span>
              <span className="work-main">
                <span className="work-name">{p.name}</span>
                <span className={`work-context${p.isLive ? ' work-status live' : ''}`}>
                  {p.isLive && <span className="dot"></span>}
                  {p.context}
                </span>
              </span>
              <span className="work-arrow">→</span>
            </button>
            <div className="work-body">
              <div className="work-body-inner">
                <p className="work-desc">{p.desc}</p>
                {p.highlight && (
                  <div className="work-highlight">{p.highlight}</div>
                )}
                {p.tags.length > 0 && (
                  <div className="work-tags">
                    {p.tags.map(tag => <span key={tag}>{tag}</span>)}
                  </div>
                )}
                <ProjectLinks links={p.links} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
