import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#101010',
          padding: '80px',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, color: '#5FCB7C', letterSpacing: 2 }}>
          PRADEEP · WEB3 + AGENTIC AI
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 64,
            fontWeight: 700,
            color: '#F2F2F0',
            lineHeight: 1.25,
            maxWidth: '900px',
          }}
        >
          <div style={{ display: 'flex' }}>I build systems that</div>
          <div style={{ display: 'flex', color: '#5FCB7C' }}>verify themselves.</div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: '#8C8C8C' }}>
          ZK proofs · on-chain agents · Web3 infrastructure — pradeeppilot.xyz
        </div>
      </div>
    ),
    { ...size }
  )
}
