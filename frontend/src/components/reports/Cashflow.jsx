"use client"

import { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { dataTableStyles, paginationOptions } from "@/components/shared/dataTableStyles"
import getAllAccounts from "@/apiServices/ledgerAccount/getAllAccount"
import getAllDonations from "@/apiServices/donations/getAllDonations"

function SummaryCard({ label, value, color }) {
    return (
        <div className={`rounded-xl border p-4 flex flex-col gap-1 ${color}`}>
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
            <span className="text-2xl font-semibold text-gray-800">${Number(value).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
        </div>
    )
}

export default function CashFlow() {
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

    // Cuentas de caja/banco = activos corrientes
    const cajaAccounts = accounts.filter(
        (a) => a.type === "Activo" && a.subType === "Activo Corriente"
    )
    const totalCaja = cajaAccounts.reduce((s, a) => s + Number(a.currentBalance), 0)

    // Ingresos operativos (donaciones confirmadas)
    const donacionesConfirmadas = donations.flatMap((d) =>
        (d.donationItems ?? []).filter((i) => i.status === "Confirmado")
    )
    const totalEntradas = donacionesConfirmadas.reduce((s, i) => s + Number(i.amount ?? 0), 0)

    // Gastos = cuentas tipo Gasto
    const gastoAccounts = accounts.filter((a) => a.type === "Gasto")
    const totalSalidas = gastoAccounts.reduce((s, a) => s + Number(a.currentBalance), 0)

    const flujoNeto = totalEntradas - totalSalidas

    const columnsCaja = [
        { name: "Código", selector: (r) => r.accountCode, sortable: true, width: "130px" },
        { name: "Cuenta", selector: (r) => r.name, sortable: true, grow: 2 },
        {
            name: "Saldo Disponible",
            selector: (r) => r.currentBalance,
            sortable: true,
            right: true,
            cell: (r) => `$${Number(r.currentBalance).toLocaleString("es-DO", { minimumFractionDigits: 2 })}`,
        },
    ]

    const columnsGastos = [
        { name: "Código", selector: (r) => r.accountCode, sortable: true, width: "130px" },
        { name: "Cuenta", selector: (r) => r.name, sortable: true, grow: 2 },
        { name: "Subtipo", selector: (r) => r.subType, sortable: true },
        {
            name: "Monto",
            selector: (r) => r.currentBalance,
            sortable: true,
            right: true,
            cell: (r) => `$${Number(r.currentBalance).toLocaleString("es-DO", { minimumFractionDigits: 2 })}`,
        },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard label="Entradas (Donaciones)" value={totalEntradas} color="bg-green-50" />
                <SummaryCard label="Salidas (Gastos)" value={totalSalidas} color="bg-red-50" />
                <SummaryCard
                    label={flujoNeto >= 0 ? "Flujo Neto Positivo" : "Flujo Neto Negativo"}
                    value={Math.abs(flujoNeto)}
                    color={flujoNeto >= 0 ? "bg-blue-50" : "bg-orange-50"}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Disponibilidad en Caja y Bancos</CardTitle>
                    <CardDescription>
                        Total disponible: <strong>${totalCaja.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columnsCaja}
                        data={cajaAccounts}
                        customStyles={dataTableStyles}
                        progressPending={loading}
                        noDataComponent={<p className="py-4 text-sm text-gray-400">Sin cuentas de caja/banco</p>}
                        highlightOnHover
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Salidas de Efectivo (Gastos)</CardTitle>
                    <CardDescription>
                        Total salidas: <strong>${totalSalidas.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columnsGastos}
                        data={gastoAccounts}
                        customStyles={dataTableStyles}
                        pagination
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10]}
                        paginationComponentOptions={paginationOptions}
                        progressPending={loading}
                        noDataComponent={<p className="py-4 text-sm text-gray-400">Sin cuentas de gasto</p>}
                        highlightOnHover
                    />
                </CardContent>
            </Card>

            <Card className={`border-2 ${flujoNeto >= 0 ? "border-blue-200 bg-blue-50" : "border-orange-200 bg-orange-50"}`}>
                <CardHeader>
                    <CardTitle className={flujoNeto >= 0 ? "text-blue-700" : "text-orange-700"}>
                        Flujo Neto de Efectivo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className={`text-3xl font-bold ${flujoNeto >= 0 ? "text-blue-700" : "text-orange-700"}`}>
                        {flujoNeto < 0 ? "-" : ""}${Math.abs(flujoNeto).toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
