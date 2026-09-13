import { useState } from 'react'
import { labById } from '../data/labs'
import {
  monogram,
  opportunityCount,
  partnersRanked,
  sponsorStatus,
  sponsorStatusLabel,
  typeLabel,
} from '../derive'
import { IconOpen } from '../components/Icons'
import type { PartnerType } from '../types'

type TypeFilter = 'all' | PartnerType
type StatusFilter = 'all' | 'engaged' | 'indicative' | 'unattributed'

const typeOptions: TypeFilter[] = ['all', 'corporate', 'foundation', 'public_body', 'ecosystem']
const statusOptions: StatusFilter[] = ['all', 'engaged', 'indicative', 'unattributed']

export default function Sponsors({
  query,
  filtersOpen,
  onOpenPartner,
}: {
  query: string
  filtersOpen: boolean
  onOpenPartner: (id: string) => void
}) {
  const [type, setType] = useState<TypeFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')

  const q = query.trim().toLowerCase()
  const rows = partnersRanked.filter((p) => {
    if (type !== 'all' && p.type !== type) return false
    if (status !== 'all' && sponsorStatus(p) !== status) return false
    if (!q) return true
    return (
      p.name.toLowerCase().includes(q) ||
      p.sectors.some((s) => s.toLowerCase().includes(q)) ||
      p.currentLabs.some((a) => labById[a.labId].name.toLowerCase().includes(q))
    )
  })

  return (
    <>
      <p className="lede">
        Every organisation found on their public pages: what it does, which labs name it, and
        whether that naming is a partner listing or a looser mention. <strong>Untapped</strong>{' '}
        counts the labs where this sponsor is a strong fit but has no visible relationship.
        Select any row for the full record and the page it came from.
      </p>

      {filtersOpen && (
        <div className="filterbar">
          <div className="filter-group">
            <span className="filter-label">Type</span>
            {typeOptions.map((t) => (
              <button key={t} className="chip" aria-pressed={type === t} onClick={() => setType(t)}>
                {t === 'all' ? 'All' : typeLabel[t]}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <span className="filter-label">Attribution</span>
            {statusOptions.map((s) => (
              <button
                key={s}
                className="chip"
                aria-pressed={status === s}
                onClick={() => setStatus(s)}
              >
                {s === 'all' ? 'All' : sponsorStatusLabel[s]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="table-head" role="row">
        <span>Sponsor</span>
        <span>Type</span>
        <span>Sector</span>
        <span>Labs engaged</span>
        <span>Attribution</span>
        <span className="num">Untapped</span>
        <span />
      </div>

      <div className="rows">
        {rows.map((p) => {
          const st = sponsorStatus(p)
          const untapped = opportunityCount(p)
          return (
            <button className="row" key={p.id} onClick={() => onOpenPartner(p.id)}>
              <span className="cell-name">
                <span className="tile" aria-hidden="true">
                  {monogram(p.name)}
                </span>
                <span className="name-block">
                  <strong>{p.name}</strong>
                  <span className="sub">{p.sectors[0]}</span>
                </span>
              </span>

              <span className="cell-type">{typeLabel[p.type]}</span>

              <span className="cell-sector">{p.sectors.slice(0, 2).join(', ')}</span>

              <span className="cell-labs">
                {p.currentLabs.length === 0 ? (
                  <span className="muted">None named</span>
                ) : (
                  p.currentLabs.map((a) => (
                    <span key={a.labId} className={'labtag ' + a.confidence}>
                      {labById[a.labId].short}
                    </span>
                  ))
                )}
              </span>

              <span>
                <span className={'pill ' + st}>{sponsorStatusLabel[st]}</span>
              </span>

              <span className="num">
                {untapped > 0 ? <strong>{untapped}</strong> : <span className="muted">0</span>}
              </span>

              <span className="cell-action" aria-hidden="true">
                <IconOpen />
              </span>
            </button>
          )
        })}
      </div>

      {rows.length === 0 && (
        <p className="empty">
          No sponsor matches that search and filter combination.
        </p>
      )}

      <p className="tablefoot">
        {rows.length} of {partnersRanked.length} sponsors. Untapped counts labs where this
        sponsor is a strong candidate but has no visible relationship.
      </p>
    </>
  )
}
