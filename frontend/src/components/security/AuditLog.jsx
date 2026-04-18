import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"
import { getAllAuditLogs } from "@/apiServices/securityService/auditLogService"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

const SKELETON_ROWS = 8

/* ── Helpers de formato ── */

function formatDate(dateStr) {
  if (!dateStr) return "—"
  const d = new Date(dateStr)
  return d.toLocaleString("es-DO", { dateStyle: "medium", timeStyle: "short" })
}

function timeAgo(dateStr) {
  if (!dateStr) return ""
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "hace un momento"
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  return `hace ${days}d`
}

/* ── Mapeo de tablas/módulos a nombres legibles ── */

const MODULE_LABELS = {
  User: "Usuarios",
  Role: "Roles",
  Member: "Miembros",
  Family: "Familias",
  Event: "Eventos",
  Donation: "Donaciones",
  LedgerAccount: "Cuentas contables",
  JournalEntry: "Asientos contables",
  Attendance: "Asistencia",
  Vendor: "Proveedores",
  ExpenseInvoice: "Facturas",
  TaxReceipt: "Comprobantes fiscales",
}

const ACTION_LABELS = {
  CREATE: { label: "Creó", icon: "➕", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  UPDATE: { label: "Actualizó", icon: "✏️", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  DELETE: { label: "Eliminó", icon: "🗑️", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

/* ── Interpretar el endpoint para dar contexto extra ── */

function interpretEndpoint(endpoint, operation) {
  if (!endpoint) return null
  const lower = endpoint.toLowerCase()
  if (lower.includes("/deactivate")) return "Desactivó usuario"
  if (lower.includes("/activate")) return "Activó usuario"
  if (lower.includes("/change-password")) return "Cambió contraseña"
  if (lower.includes("/register")) return "Registró nuevo usuario"
  if (lower.includes("/refresh")) return "Renovó sesión"
  return null
}

/* ── Extraer datos relevantes del body JSON ── */

function parseRelevantData(newValues) {
  if (!newValues) return null
  try {
    const data = JSON.parse(newValues)
    const relevant = {}
    if (data.Name) relevant["Nombre"] = data.Name
    if (data.Email) relevant["Email"] = data.Email
    if (data.name) relevant["Nombre"] = data.name
    if (data.email) relevant["Email"] = data.email
    return Object.keys(relevant).length > 0 ? relevant : null
  } catch {
    return null
  }
}

/* ── Generar descripción legible ── */

function getDescription(log) {
  const special = interpretEndpoint(log.endpoint, log.operation)
  if (special) return special

  const action = ACTION_LABELS[log.operation]?.label || log.operation
  const module = MODULE_LABELS[log.affectedTable] || log.affectedTable
  return `${action} en ${module}`
}

function ActionBadge({ operation }) {
  const config = ACTION_LABELS[operation] || { label: operation, icon: "•", color: "bg-secondary text-secondary-foreground" }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}

function DataPreview({ newValues }) {
  const data = parseRelevantData(newValues)
  if (!data) return null
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(data).map(([key, val]) => (
        <span key={key} className="text-xs bg-muted px-1.5 py-0.5 rounded">
          {key}: {val}
        </span>
      ))}
    </div>
  )
}

export default function AuditLog() {
  const { apiClient } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllAuditLogs(apiClient)
      setLogs(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const filtered = logs.filter((log) => {
    const term = search.toLowerCase()
    const desc = getDescription(log).toLowerCase()
    const module = (MODULE_LABELS[log.affectedTable] || log.affectedTable || "").toLowerCase()
    return (
      desc.includes(term) ||
      module.includes(term) ||
      log.userName?.toLowerCase().includes(term) ||
      log.operation?.toLowerCase().includes(term)
    )
  })

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-destructive text-sm">{error}</p>
        <Button variant="outline" onClick={fetchLogs}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Auditoría del Sistema</h1>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Buscar por usuario, acción, módulo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" size="sm" onClick={fetchLogs}>Actualizar</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead>Módulo</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>IP Origen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No hay registros de auditoría.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((log) => (
              <TableRow key={log.logId}>
                <TableCell>
                  <div className="whitespace-nowrap text-sm">{formatDate(log.timestamp)}</div>
                  <div className="text-xs text-muted-foreground">{timeAgo(log.timestamp)}</div>
                </TableCell>
                <TableCell className="font-medium">{log.userName || `Usuario #${log.userId}`}</TableCell>
                <TableCell><ActionBadge operation={log.operation} /></TableCell>
                <TableCell>{MODULE_LABELS[log.affectedTable] || log.affectedTable}</TableCell>
                <TableCell>
                  <div className="text-sm">{getDescription(log)}</div>
                  <DataPreview newValues={log.newValues} />
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">{log.sourceIp || "—"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
