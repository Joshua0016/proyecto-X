"use client"

import { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { dataTableStyles, paginationOptions } from "@/components/shared/dataTableStyles"
import getAllAccounts from "@/apiServices/ledgerAccount/getAllAccount"

function SummaryCard({ label, value, color }) {
    return (
        <div className={`rounded-xl border p-4 flex flex-col gap-1 ${color}`}>
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
            <span className="text-2xl font-semibold text-gray-800">${Number(value).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
        </div>
    )
}

export default function StatementResults() {
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

    const ingresos = accounts.filter((a) => a.type === "Ingreso")
    const gastos = accounts.filter((a) => a.type === "Gasto")

    const totalIngresos = ingresos.reduce((s, a) => s + Number(a.currentBalance), 0)
    const totalGastos = gastos.reduce((s, a) => s + Number(a.currentBalance), 0)
    const utilidad = totalIngresos - totalGastos

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
                <SummaryCard label="Total Ingresos" value={totalIngresos} color="bg-green-50" />
                <SummaryCard label="Total Gastos" value={totalGastos} color="bg-red-50" />
                <SummaryCard
                    label={utilidad >= 0 ? "Utilidad Neta" : "Pérdida Neta"}
                    value={Math.abs(utilidad)}
                    color={utilidad >= 0 ? "bg-blue-50" : "bg-orange-50"}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ingresos</CardTitle>
                    <CardDescription>
                        Total: <strong>${totalIngresos.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={ingresos}
                        customStyles={dataTableStyles}
                        pagination
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10]}
                        paginationComponentOptions={paginationOptions}
                        progressPending={loading}
                        noDataComponent={<p className="py-4 text-sm text-gray-400">Sin cuentas de ingreso</p>}
                        highlightOnHover
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Gastos</CardTitle>
                    <CardDescription>
                        Total: <strong>${totalGastos.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={gastos}
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

            <Card className={`border-2 ${utilidad >= 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <CardHeader>
                    <CardTitle className={utilidad >= 0 ? "text-green-700" : "text-red-700"}>
                        {utilidad >= 0 ? "Utilidad Neta" : "Pérdida Neta"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className={`text-3xl font-bold ${utilidad >= 0 ? "text-green-700" : "text-red-700"}`}>
                        {utilidad < 0 ? "-" : ""}${Math.abs(utilidad).toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
