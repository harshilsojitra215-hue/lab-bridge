import { useMemo, useState } from 'react'
import {
  IconCrossLab,
  IconLabs,
  IconMatrix,
  IconMethod,
  IconOverview,
  IconSponsors,
  IconSearch,
  IconFilter,
} from './components/Icons'
import Overview from './views/Overview'
import Sponsors from './views/Sponsors'
import CrossLab from './views/CrossLab'
import Labs from './views/Labs'
import Coverage from './views/Coverage'
import Method from './views/Method'
import PartnerDrawer from './components/PartnerDrawer'
import { partners } from './data/partners'
import { opportunities, totals } from './derive'

export type ViewId = 'overview' | 'sponsors' | 'crosslab' | 'labs' | 'coverage' | 'method'

const nav: { id: ViewId; label: string; icon: () => JSX.Element; count?: number }[] = [
  { id: 'overview', label: 'Overview', icon: IconOverview },
  { id: 'sponsors', label: 'Sponsors', icon: IconSponsors, count: partners.length },
  { id: 'crosslab', label: 'Cross-lab', icon: IconCrossLab, count: opportunities.length },
  { id: 'labs', label: 'Labs', icon: IconLabs, count: totals.labs },
  { id: 'coverage', label: 'Coverage', icon: IconMatrix },
  { id: 'method', label: 'Method', icon: IconMethod },
]

const searchable = new Set<ViewId>(['sponsors', 'crosslab', 'labs'])

export default function App() {
  const [view, setView] = useState<ViewId>('overview')
  const [openPartner, setOpenPartner] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const go = (v: ViewId) => {
    setView(v)
    setQuery('')
    setFiltersOpen(false)
  }

  const title = useMemo(() => nav.find((n) => n.id === view)!.label, [view])

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            LB
          </span>
          <span className="brand-text">
            <strong>Lab Bridge</strong>
            <span>Sponsor relations</span>
          </span>
        </div>

        <nav className="nav" aria-label="Sections">
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className="nav-item"
                aria-current={view === item.id}
                onClick={() => go(item.id)}
              >
                <Icon />
                <span className="nav-label">{item.label}</span>
                {item.count !== undefined && <span className="nav-count">{item.count}</span>}
              </button>
            )
          })}
        </nav>

        <p className="sidebar-foot">
          Independent prototype. Built from public information on tum-venture-labs.de. Not
          affiliated with TUM Venture Labs.
        </p>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-title">
            <h1>{title}</h1>
            <span className="crumb">Cross-lab sponsor map · public data</span>
          </div>

          <div className="topbar-tools">
            {searchable.has(view) && (
              <label className="search">
                <IconSearch />
                <input
                  type="search"
                  value={query}
                  placeholder={
                    view === 'sponsors'
                      ? 'Search sponsor or sector'
                      : view === 'crosslab'
                        ? 'Search sponsor or lab'
                        : 'Search lab or technology'
                  }
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            )}
            {view === 'sponsors' && (
              <button
                className="btn"
                aria-pressed={filtersOpen}
                onClick={() => setFiltersOpen((v) => !v)}
              >
                <IconFilter />
                Filters
              </button>
            )}
          </div>
        </header>

        <div className="content">
          {view === 'overview' && <Overview onOpenPartner={setOpenPartner} onGo={go} />}
          {view === 'sponsors' && (
            <Sponsors
              query={query}
              filtersOpen={filtersOpen}
              onOpenPartner={setOpenPartner}
            />
          )}
          {view === 'crosslab' && <CrossLab query={query} onOpenPartner={setOpenPartner} />}
          {view === 'labs' && <Labs query={query} onOpenPartner={setOpenPartner} />}
          {view === 'coverage' && <Coverage onOpenPartner={setOpenPartner} />}
          {view === 'method' && <Method />}
        </div>
      </div>

      {openPartner && (
        <PartnerDrawer id={openPartner} onClose={() => setOpenPartner(null)} />
      )}
    </div>
  )
}
