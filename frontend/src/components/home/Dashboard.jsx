import { useAuth } from "@/hooks/useAuth"

import { useNavigate } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import {
  UsersIcon,
  HandCoinsIcon,
  CalendarIcon,
  TrendingUpIcon,
  PlusIcon,
  ArrowRightIcon,
  ClockIcon,
  ActivityIcon,
  Loader2Icon,
} from "lucide-react"
import getAllMembers from "@/apiServices/members/getAllMembers"
import getAllEvents from "@/apiServices/events/getAllEvents"
import getAllDonations from "@/apiServices/donations/getAllDonations"



function getGreeting() {
  const h = new Date().getHours()
  if (h >= 6 && h < 12) return "Buenos días"
  if (h >= 12 && h < 20) return "Buenas tardes"
  return "Buenas noches"
}


// 4 cards principales
function MetricCard({ title, value, subtitle, icon: Icon, color, loading }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl glass p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br ${color} blur-2xl`} />
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          {loading ? (
            <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
          ) : (
            <p className="text-3xl font-bold text-foreground">{value}</p>
          )}
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className={`flex items-center justify-center size-11 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
          <Icon className="size-5" />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  )
}


// actividad reciente

function ActivityItem({ action, detail, time, type }) {
  const colors = {
    member: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    donation: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    event: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  }
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/10 last:border-0 transition-all hover:bg-white/10 dark:hover:bg-white/5 backdrop-blur-sm px-2 -mx-2 rounded-lg">
      <div className={`flex items-center justify-center size-9 rounded-lg ${colors[type] || colors.member}`}>
        <ActivityIcon className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{action}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
        <ClockIcon className="size-3" />
        {time}
      </div>
    </div>
  )
}

function timeAgo(dateStr) {
  if (!dateStr) return ""
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Ahora"
  if (mins < 60) return `Hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  return `Hace ${days}d`
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState([])
  const [donations, setDonations] = useState([])
  const [events, setEvents] = useState([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [m, d, e] = await Promise.all([
        getAllMembers(),
        getAllDonations(),
        getAllEvents(),
      ])
      setMembers(m || [])
      setDonations(d || [])
      setEvents(e || [])
    } catch {
      // silently handle
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  /* ── Computed metrics ── */
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const monthDonations = donations.filter((d) => {
    const date = new Date(d.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const totalDonationsAmount = monthDonations.reduce((sum, d) => {
    const itemsTotal = (d.items || []).reduce((s, item) => s + (item.amount || 0), 0)
    return sum + itemsTotal
  }, 0)

  const upcomingEvents = events
    .filter((e) => new Date(e.startDate) >= now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 5)

  /* ── Recent activity (combine latest members, donations, events) ── */
  const recentActivity = [
    ...members.slice(-5).reverse().map((m) => ({
      action: "Miembro registrado",
      detail: `${m.firstName} ${m.lastName}`,
      time: timeAgo(m.createdAt || m.registrationDate),
      type: "member",
      date: m.createdAt || m.registrationDate || "2024-01-01",
    })),
    ...donations.slice(-5).reverse().map((d) => ({
      action: "Donación recibida",
      detail: `$${(d.items || []).reduce((s, i) => s + (i.amount || 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      time: timeAgo(d.date),
      type: "donation",
      date: d.date,
    })),
    ...events.slice(-5).reverse().map((e) => ({
      action: "Evento creado",
      detail: e.name || e.title,
      time: timeAgo(e.createdAt || e.startDate),
      type: "event",
      date: e.createdAt || e.startDate,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8)

  const quickActions = [
    { label: "Agregar miembro", icon: UsersIcon, url: "/home/members" },
    { label: "Registrar donación", icon: HandCoinsIcon, url: "/home/donations" },
    { label: "Crear evento", icon: CalendarIcon, url: "/home/events" },
  ]

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-background via-background to-muted/40">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {user?.name || "Usuario"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Resumen de la actividad de la iglesia
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {now.toLocaleDateString("es-DO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Miembros" value={members.length} subtitle={`${monthDonations.length} donaciones este mes`} icon={UsersIcon} color="from-blue-500 to-blue-600" loading={loading} />
        <MetricCard title="Donaciones del Mes" value={`$${totalDonationsAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} subtitle={`${monthDonations.length} transacciones`} icon={HandCoinsIcon} color="from-emerald-500 to-emerald-600" loading={loading} />
        <MetricCard title="Eventos Próximos" value={upcomingEvents.length} subtitle={`${events.length} eventos totales`} icon={CalendarIcon} color="from-violet-500 to-violet-600" loading={loading} />
        <MetricCard title="Total Donaciones" value={donations.length} subtitle="Registros históricos" icon={TrendingUpIcon} color="from-amber-500 to-amber-600" loading={loading} />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {quickActions.map((a) => (
          <button key={a.label} onClick={() => navigate(a.url)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
            <PlusIcon className="size-4" />
            {a.label}
          </button>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl glass p-5 shadow-lg">
          <h2 className="text-lg font-semibold text-foreground mb-4">Actividad Reciente</h2>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2Icon className="size-6 animate-spin text-muted-foreground" /></div>
          ) : recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Sin actividad reciente</p>
          ) : (
            recentActivity.map((item, i) => <ActivityItem key={i} {...item} />)
          )}
        </div>

        {/* Upcoming Events */}
        <div className="rounded-2xl glass p-5 shadow-lg">
          <h2 className="text-lg font-semibold text-foreground mb-4">Eventos Próximos</h2>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2Icon className="size-6 animate-spin text-muted-foreground" /></div>
          ) : upcomingEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No hay eventos próximos</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((ev) => (
                <div key={ev.eventId || ev.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 text-white text-xs font-bold shrink-0">
                    {new Date(ev.startDate).toLocaleDateString("es-DO", { day: "2-digit" })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{ev.name || ev.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ev.startDate).toLocaleDateString("es-DO", { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => navigate("/home/events")} className="w-full mt-4 text-sm text-primary hover:underline flex items-center justify-center gap-1">
            Ver todos los eventos <ArrowRightIcon className="size-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
