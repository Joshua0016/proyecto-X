"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import getAllAccounts from "@/apiServices/ledgerAccount/getAllAccount"
import getAllDonations from "@/apiServices/donations/getAllDonations"

function MetricCard({ label, value, sub, color }) {
    return (
        <div className={`rounded-xl border p-5 flex flex-col gap-2 ${color}`}>
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
            <span className="text-3xl font-bold text-gray-800">
                ${Number(value).toLocaleString("es-DO", { minimumFractionDigits: 2 })}
            </span>
            {sub && <span className="text-xs text-gray-400">{sub}</span>}
        </div>
    )
}

function ProgressBar({ label, value, max, color }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm text-gray-600">
                <span>{label}</span>
                <span>${Number(value).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    )
}

export default function FinancialStatement() {
    const [accounts, setAccounts] = useState([])
    const [donations, setDonations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const [acc, don] = await Promise.all([getAllAccounts(), getAllDonations()])
            setAccounts(acc ?? [])
            setDonations(don ?? [])
            setLoading(false)
        }
        load()
    }, [])

    const totalActivos = accounts.filter((a) => a.type === "Activo").reduce((s, a) => s + Number(a.currentBalance), 0)
    const totalPasivos = accounts.filter((a) => a.type === "Pasivo").reduce((s, a) => s + Number(a.currentBalance), 0)
    const totalPatrimonio = accounts.filter((a) => a.type === "Patrimonio").reduce((s, a) => s + Number(a.currentBalance), 0)
    const totalIngresos = accounts.filter((a) => a.type === "Ingreso").reduce((s, a) => s + Number(a.currentBalance), 0)
    const totalGastos = accounts.filter((a) => a.type === "Gasto").reduce((s, a) => s + Number(a.currentBalance), 0)
    const utilidad = totalIngresos - totalGastos

    const caja = accounts.filter((a) => a.type === "Activo" && a.subType === "Activo Corriente").reduce((s, a) => s + Number(a.currentBalance), 0)
    const activosFijos = accounts.filter((a) => a.type === "Activo" && a.subType === "Activo No Corriente").reduce((s, a) => s + Number(a.currentBalance), 0)

    const totalDonaciones = donations.length
    const donacionesConfirmadas = donations.flatMap((d) => (d.donationItems ?? []).filter((i) => i.status === "Confirmado")).length

    const ratioSolvencia = totalPasivos > 0 ? (totalActivos / totalPasivos).toFixed(2) : "N/A"
    const ratioLiquidez = totalPasivos > 0 ? (caja / totalPasivos).toFixed(2) : "N/A"

    if (loading) {
        return <p className="text-sm text-gray-400 p-4">Cargando estado financiero...</p>
    }

    return (
        <div className="flex flex-col gap-6">

            {/* Resumen general */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <MetricCard label="Total Activos" value={totalActivos} color="bg-blue-50" />
                <MetricCard label="Total Pasivos" value={totalPasivos} color="bg-red-50" />
                <MetricCard label="Patrimonio" value={totalPatrimonio} color="bg-purple-50" />
                <MetricCard
                    label={utilidad >= 0 ? "Utilidad Neta" : "Pérdida Neta"}
                    value={Math.abs(utilidad)}
                    color={utilidad >= 0 ? "bg-green-50" : "bg-orange-50"}
                />
            </div>

            {/* Composición de activos */}
            <Card>
                <CardHeader>
                    <CardTitle>Composición de Activos</CardTitle>
                    <CardDescription>Distribución entre activos corrientes y no corrientes</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <ProgressBar label="Caja y Bancos (Corriente)" value={caja} max={totalActivos} color="bg-blue-400" />
                    <ProgressBar label="Activos Fijos (No Corriente)" value={activosFijos} max={totalActivos} color="bg-indigo-400" />
                </CardContent>
            </Card>

            {/* Ingresos vs Gastos */}
            <Card>
                <CardHeader>
                    <CardTitle>Ingresos vs Gastos</CardTitle>
                    <CardDescription>Comparativa del período actual</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <ProgressBar label="Ingresos" value={totalIngresos} max={Math.max(totalIngresos, totalGastos)} color="bg-green-400" />
                    <ProgressBar label="Gastos" value={totalGastos} max={Math.max(totalIngresos, totalGastos)} color="bg-red-400" />
                    <div className={`mt-2 rounded-lg p-3 text-sm font-medium ${utilidad >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {utilidad >= 0 ? "Superávit" : "Déficit"}: ${Math.abs(utilidad).toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                    </div>
                </CardContent>
            </Card>

            {/* Indicadores y donaciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Indicadores Financieros</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <div className="flex justify-between border-b pb-2 text-sm">
                            <span className="text-gray-500">Ratio de Solvencia</span>
                            <span className="font-semibold">{ratioSolvencia}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 text-sm">
                            <span className="text-gray-500">Ratio de Liquidez</span>
                            <span className="font-semibold">{ratioLiquidez}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 text-sm">
                            <span className="text-gray-500">Activos / Pasivos</span>
                            <span className={`font-semibold ${totalActivos >= totalPasivos ? "text-green-600" : "text-red-600"}`}>
                                {totalPasivos > 0 ? `${((totalActivos / totalPasivos) * 100).toFixed(1)}%` : "Sin pasivos"}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Margen Neto</span>
                            <span className={`font-semibold ${utilidad >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {totalIngresos > 0 ? `${((utilidad / totalIngresos) * 100).toFixed(1)}%` : "N/A"}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Resumen de Donaciones</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <div className="flex justify-between border-b pb-2 text-sm">
                            <span className="text-gray-500">Total registradas</span>
                            <span className="font-semibold">{totalDonaciones}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 text-sm">
                            <span className="text-gray-500">Ítems confirmados</span>
                            <span className="font-semibold text-green-600">{donacionesConfirmadas}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Cuentas activas</span>
                            <span className="font-semibold">{accounts.filter((a) => a.isActive).length}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
