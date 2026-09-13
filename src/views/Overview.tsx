import { labById } from '../data/labs'
import { labCoverage, monogram, opportunities, totals } from '../derive'
import type { ViewId } from '../App'

export default function Overview({
  onOpenPartner,
  onGo,
}: {
  onOpenPartner: (id: string) => void
  onGo: (v: ViewId) => void
}) {
  /**
   * One introduction per sponsor. The raw queue is ranked by how many labs already hold the
   * relationship, so a company sitting in four labs takes the first four rows and the opening
   * screen reads as a list about one company. The queue keeps every pair; this is the summary,
   * and a summary showing six different sponsors is the more useful thing to look at first.
   */
  const seen = new Set<string>()
  const top = opportunities.filter((o) => {
    if (seen.has(o.partner.id)) return false
    seen.add(o.partner.id)
    return true
  }).slice(0, 6)

  const coverage = [...labCoverage].sort((a, b) => b.candidates - a.candidates)

  return (
    <>
      {/*
        The argument, before the numbers. Someone arriving from a link has no idea what this is
        for, and a dashboard that opens on four figures and a table asks them to work it out.
        The numbers only mean something once the gap they measure has been named.
      */}
      <section className="thesis">
        <p className="thesis-lede">
          Twelve labs each develop their own sponsors. Sponsors are not domain specific — a
          company one lab has already won is often a warm relationship for three others, and no
          lab can see that from where it sits.
        </p>
        <p className="thesis-sub">
          Lab Bridge maps every publicly listed partner against all twelve labs and names the lab
          that could make each introduction. It is built from their public pages only, which is a
          real limit:{' '}
          <button className="link inline" onClick={() => onGo('method')}>
            how it works, and what it cannot tell you
          </button>
          .
        </p>
      </section>

      <div className="kpis">
        <Kpi
          value={totals.partners}
          label="Sponsors mapped"
          note="Every one links to the page it was found on"
        />
        <Kpi
          value={totals.partnersWithOpportunity}
          label="Could be introduced"
          note="A strong fit for a lab that has not approached them"
          accent
        />
        <Kpi
          value={opportunities.length}
          label="Introductions available"
          note="Sponsor-and-lab pairs, ranked in Cross-lab"
        />
        <Kpi
          value={totals.inferredAssociations}
          label="Unconfirmed associations"
          note={`of ${totals.confirmedAssociations + totals.inferredAssociations} — read from page context, not a partner list`}
          warn
        />
      </div>

      <section className="panel">
        <div className="panel-head">
          <div className="panel-title">
            <h2>Priority introductions</h2>
            <span className="panel-sub">
              The strongest opening per sponsor. Left tag is the lab that already holds the
              relationship; right tag is the lab that could be introduced.
            </span>
          </div>
          <button className="link" onClick={() => onGo('crosslab')}>
            View all {opportunities.length}
          </button>
        </div>
        <div className="rows compact">
          {top.map((o) => (
            <button
              className="row overview"
              key={`${o.partner.id}-${o.fit.labId}`}
              onClick={() => onOpenPartner(o.partner.id)}
            >
              <span className="cell-name">
                <span className="tile" aria-hidden="true">
                  {monogram(o.partner.name)}
                </span>
                <span className="name-block">
                  <strong>{o.partner.name}</strong>
                  <span className="sub">{o.fit.reasoning}</span>
                </span>
              </span>
              <span className="cell-move">
                <span className="labtag confirmed">{labById[o.introducers[0]].short}</span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
                <span className="labtag target">{labById[o.fit.labId].short}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div className="panel-title">
            <h2>Lab coverage</h2>
            <span className="panel-sub">
              How many sponsors each lab already works with, against how many it could reach
              through another lab.
            </span>
          </div>
          <button className="link" onClick={() => onGo('labs')}>
            All twelve labs
          </button>
        </div>
        <div className="coverage-grid">
          {coverage.map((c) => (
            <div className="cov" key={c.lab.id}>
              <span className="cov-dot" style={{ background: c.lab.color }} aria-hidden="true" />
              <span className="cov-name">{c.lab.name}</span>
              <span className="cov-bar" aria-hidden="true">
                <span
                  className="cov-fill"
                  style={{
                    width: `${(c.engaged / Math.max(1, c.engaged + c.candidates)) * 100}%`,
                    background: c.lab.color,
                  }}
                />
              </span>
              <span className="cov-nums">
                <strong>{c.engaged}</strong>
                <span className="muted"> engaged</span>
                <span className="cov-sep">·</span>
                <strong>{c.candidates}</strong>
                <span className="muted"> untapped</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function Kpi({
  value,
  label,
  note,
  accent,
  warn,
}: {
  value: number
  label: string
  note: string
  accent?: boolean
  warn?: boolean
}) {
  return (
    <div className={'kpi' + (accent ? ' accent' : '') + (warn ? ' warn' : '')}>
      <span className="kpi-value">{value}</span>
      <span className="kpi-label">{label}</span>
      <span className="kpi-note">{note}</span>
    </div>
  )
}
