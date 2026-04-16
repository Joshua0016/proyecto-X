"use client"

import { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { dataTableStyles, paginationOptions } from "@/components/shared/dataTableStyles"
import getAllAccounts from "@/apiServices/ledgerAccount/getAllAccount"

const TYPES = ["Activo", "Pasivo", "Patrimonio"]

function groupBySubType(accounts) {
    return accounts.reduce((acc, item) => {
        const key = item.subType ?? "Sin clasificar"
        if (!acc[key]) acc[key] = []
        acc[key].push(item)
        return acc
    }, {})
}

function SummaryCard({ label, value, color }) {
    return (
        <div className={`rounded-xl border p-4 flex flex-col gap-1 ${color}`}>
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
            <span className="text-2xl font-semibold text-gray-800">${Number(value).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
        </div>
    )
}

export default function BalanceGeneral() {
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const data = await getAllAccounts()
            setAccounts(data ?? [])
            setLoading(false)
        }
        load()
    }, [])

    const byType = TYPES.reduce((acc, t) => {
        acc[t] = accounts.filter((a) => a.type === t)
        return acc
    }, {})

    const totalActivos = byType["Activo"].reduce((s, a) => s + Number(a.currentBalance), 0)
    const totalPasivos = byType["Pasivo"].reduce((s, a) => s + Number(a.currentBalance), 0)
    const totalPatrimonio = byType["Patrimonio"].reduce((s, a) => s + Number(a.currentBalance), 0)

    const columns = [
        { name: "Código", selector: (r) => r.accountCode, sortable: true, width: "130px" },
        { name: "Cuenta", selector: (r) => r.name, sortable: true, grow: 2 },
        { name: "Subtipo", selector: (r) => r.subType, sortable: true },
        {
            name: "Saldo",
            selector: (r) => r.currentBalance,
            sortable: true,
            right: true,
            cell: (r) => `$${Number(r.currentBalance).toLocaleString("es-DO", { minimumFractionDigits: 2 })}`,
        },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard label="Total Activos" value={totalActivos} color="bg-blue-50" />
                <SummaryCard label="Total Pasivos" value={totalPasivos} color="bg-red-50" />
                <SummaryCard label="Patrimonio" value={totalPatrimonio} color="bg-green-50" />
            </div>

            {TYPES.map((type) => {
                const grouped = groupBySubType(byType[type])
                const total = byType[type].reduce((s, a) => s + Number(a.currentBalance), 0)
                return (
                    <Card key={type}>
                        <CardHeader>
                            <CardTitle>{type}s</CardTitle>
                            <CardDescription>
                                Total: <strong>${total.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {Object.entries(grouped).map(([subType, rows]) => (
                                <div key={subType}>
                                    <p className="text-xs font-semibold uppercase text-gray-400 mb-1 px-1">{subType}</p>
                                    <DataTable
                                        columns={columns}
                                        data={rows}
                                        customStyles={dataTableStyles}
                                        noDataComponent={<p className="py-4 text-sm text-gray-400">Sin cuentas</p>}
                                        progressPending={loading}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
