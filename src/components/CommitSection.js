import ShinyText from '@/components/ShinyText'
import ContributionGraph from '@/components/ContributionGraph'

export default function CommitSection() {
  return (
    <div className="wrap" id="commits">
      <div className="section-label">
        <ShinyText text="Commit History" speed={2.5} color="var(--muted)" shineColor="var(--ink)" />
      </div>
      <div className="about">
        <ContributionGraph />
      </div>
    </div>
  )
}