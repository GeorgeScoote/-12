import { useEffect, useState } from "react"

interface AgentResult {
  rank: number
  address: string
  block: number
  type: "persistent" | "sovereign"
}

function formatBlock(block: number) {
  const now = 38600000
  const diff = now - block
  const mins = Math.floor(diff * 0.35 / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function App() {
  const [input, setInput] = useState("")
  const [agents, setAgents] = useState<AgentResult[]>([])
  const [loaded, setLoaded] = useState(false)
  const [result, setResult] = useState<AgentResult | null>(null)
  const [searched, setSearched] = useState(false)
  const [copied, setCopied] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    fetch("/agents-data.json")
      .then((r) => r.json())
      .then((d: AgentResult[]) => { setAgents(d); setLoaded(true) })
      .catch(console.error)
  }, [])

  const search = () => {
    const q = input.toLowerCase().trim()
    if (!q) return
    setSearched(true)
    setResult(null)
    setCopied(false)
    setTimeout(() => {
      const found = agents.find(
        (a) => a.address.toLowerCase() === q || a.address.toLowerCase().slice(0, 10) === q
      )
      if (found) setResult(found)
    }, 150)
  }

  const stats = loaded
    ? {
        total: agents.length,
        persistent: agents.filter((a) => a.type === "persistent").length,
        sovereign: agents.filter((a) => a.type === "sovereign").length,
        latest: Math.max(...agents.map((a) => a.block)),
      }
    : null

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden relative">
      {/* Background image on left/right margins */}
      <div className="fixed inset-0 pointer-events-none flex justify-center" style={{ zIndex: 0 }}>
        <div className="w-full max-w-7xl mx-auto relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[25vw] max-w-[300px] h-[60vh] opacity-25 bg-cover bg-center" style={{ backgroundImage: 'url(/bg.jpg)' }} />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[25vw] max-w-[300px] h-[60vh] opacity-25 bg-cover bg-center" style={{ backgroundImage: 'url(/bg.jpg)' }} />
        </div>
      </div>

      {/* Subtle gradient accent */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[100px]" />
      </div>

      {/* Twitter */}
      <a
        href="https://x.com/Felqeutler"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 text-sm text-gray-500 hover:text-gray-700 transition-all z-10"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        @Felqeutler
      </a>

      <div className="relative max-w-3xl mx-auto px-4 py-16" style={{ zIndex: 1 }}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-200 bg-purple-50 text-xs text-purple-600 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            {loaded ? `${stats!.total} Agents on Network` : "Loading..."}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-purple-700 to-purple-500 bg-clip-text text-transparent">
            Ritual Agent Explorer
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
            智能代理链接未来，RITUAL 链接全球
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Smart Agents Connect the Future, RITUAL Connects the World
          </p>
        </div>

        {/* Search */}
        <div className={`relative transition-all duration-300 ${focused ? "scale-[1.02]" : "scale-100"}`}>
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-purple-300 to-emerald-300 rounded-2xl opacity-30 blur-sm" />
          <div className="relative bg-white/95 border border-gray-200 rounded-2xl p-1 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 px-4">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                placeholder="Enter agent address (0x...)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="flex-1 bg-transparent h-14 text-sm font-mono outline-none placeholder:text-gray-400"
              />
              <button
                onClick={search}
                disabled={!loaded}
                className="px-6 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-sm font-medium text-white transition-all disabled:opacity-50 shadow-sm"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Result */}
        {searched && (
          <div className="mt-6">
            {result ? (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-300 via-purple-200 to-emerald-300 rounded-2xl opacity-40 blur-sm" />
                <div className="relative bg-white/95 border border-gray-200 rounded-2xl overflow-hidden shadow-sm backdrop-blur-sm">
                  <div className={`h-1 ${result.type === "persistent" ? "bg-gradient-to-r from-blue-400 to-blue-300" : "bg-gradient-to-r from-emerald-400 to-emerald-300"}`} />

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">AGENT</div>
                        <h2 className="text-xl font-bold flex items-center gap-3">
                          Agent #{result.rank.toLocaleString()}
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${result.type === "persistent" ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"}`}>
                            {result.type}
                          </span>
                        </h2>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">RANK</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                          #{result.rank.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                        <span className="text-sm text-gray-400">Address</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-gray-700">{result.address.slice(0, 8)}...{result.address.slice(-6)}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(result.address)
                              setCopied(true)
                              setTimeout(() => setCopied(false), 2000)
                            }}
                            className="text-xs text-purple-500 hover:text-purple-600 transition-colors"
                          >
                            {copied ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                          <div className="text-xs text-gray-400 mb-1">Block</div>
                          <div className="font-mono text-sm text-gray-700">{result.block.toLocaleString()}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                          <div className="text-xs text-gray-400 mb-1">Activity</div>
                          <div className="font-mono text-sm text-gray-700">{formatBlock(result.block)}</div>
                        </div>
                      </div>

                      <a
                        href={`https://explorer.ritualfoundation.org/address/${result.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-gray-50/80 border border-gray-200 hover:bg-gray-100 text-sm text-gray-500 hover:text-gray-700 transition-all"
                      >
                        View on Explorer
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white/95 border border-gray-200 rounded-2xl shadow-sm backdrop-blur-sm">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-400">Agent not found</p>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="mt-8 grid grid-cols-4 gap-3">
            {[
              { label: "Total Agents", value: stats.total.toLocaleString(), color: "from-purple-500 to-purple-400" },
              { label: "Persistent", value: stats.persistent.toLocaleString(), color: "from-blue-500 to-blue-400" },
              { label: "Sovereign", value: stats.sovereign.toLocaleString(), color: "from-emerald-500 to-emerald-400" },
              { label: "Latest Block", value: stats.latest.toLocaleString(), color: "from-amber-500 to-amber-400" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-white/95 border border-gray-200 text-center shadow-sm backdrop-blur-sm">
                <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Recent agents */}
        {loaded && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Recent Deployments</h3>
              <span className="text-xs text-gray-400">Last 5 agents</span>
            </div>
            <div className="space-y-2">
              {agents.slice(-5).reverse().map((a) => (
                <button
                  key={a.address}
                  onClick={() => { setInput(a.address); setSearched(false); setTimeout(() => { setInput(a.address); search() }, 50) }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/95 border border-gray-200 hover:border-gray-300 transition-all text-left group shadow-sm backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-8">#{a.rank}</span>
                    <span className="font-mono text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      {a.address.slice(0, 6)}...{a.address.slice(-4)}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${a.type === "persistent" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
                      {a.type}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{formatBlock(a.block)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400">Data from Ritual Chain</p>
          <p className="text-xs text-gray-300 mt-1">智能代理链接未来，RITUAL 链接全球</p>
        </div>
      </div>
    </div>
  )
}
