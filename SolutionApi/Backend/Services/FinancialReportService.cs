using Backend.Data;
using Backend.DTOs;
using Backend.interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class FinancialReportService(DbProyectoXContext context) : IFinancialReportService
{
    private readonly DbProyectoXContext _ctx = context;

    // ── Balance General ──
    // Usa los saldos actuales de las cuentas del libro mayor
    public async Task<BalanceSheetDTO> GetBalanceSheet()
    {
        var accounts = await _ctx.LedgerAccounts
            .Where(a => a.IsActive)
            .ToListAsync();

        var assets = accounts.Where(a => a.Type == "Asset")
            .Select(a => new AccountGroupDTO(a.AccountCode, a.Name, a.SubType, a.CurrentBalance)).ToList();
        var liabilities = accounts.Where(a => a.Type == "Liability")
            .Select(a => new AccountGroupDTO(a.AccountCode, a.Name, a.SubType, a.CurrentBalance)).ToList();
        var equity = accounts.Where(a => a.Type == "Equity")
            .Select(a => new AccountGroupDTO(a.AccountCode, a.Name, a.SubType, a.CurrentBalance)).ToList();

        var totalAssets = assets.Sum(a => a.Balance);
        var totalLiabilities = liabilities.Sum(a => a.Balance);
        var totalEquity = equity.Sum(a => a.Balance);

        return new BalanceSheetDTO(
            assets, liabilities, equity,
            totalAssets, totalLiabilities, totalEquity,
            IsBalanced: totalAssets == totalLiabilities + totalEquity
        );
    }

    // ── Estado de Resultados ──
    // Calcula ingresos y gastos a partir de transacciones en el rango de fechas
    public async Task<IncomeStatementDTO> GetIncomeStatement(DateOnly from, DateOnly to)
    {
        var fromDate = from.ToDateTime(TimeOnly.MinValue);
        var toDate = to.ToDateTime(TimeOnly.MaxValue);

        var transactions = await _ctx.LedgerTransactions
            .Include(t => t.JournalEntry)
            .Include(t => t.AccountCodeNavigation)
            .Where(t => t.JournalEntry.Date >= fromDate && t.JournalEntry.Date <= toDate)
            .Where(t => t.AccountCodeNavigation.Type == "Revenue" || t.AccountCodeNavigation.Type == "Expense")
            .ToListAsync();

        // Revenue: créditos - débitos (ingresos normalmente se acreditan)
        var revenueGroups = transactions
            .Where(t => t.AccountCodeNavigation.Type == "Revenue")
            .GroupBy(t => t.AccountCode)
            .Select(g => new AccountGroupDTO(
                g.Key,
                g.First().AccountCodeNavigation.Name,
                g.First().AccountCodeNavigation.SubType,
                g.Sum(t => t.Credit - t.Debit)
            )).ToList();

        // Expense: débitos - créditos (gastos normalmente se debitan)
        var expenseGroups = transactions
            .Where(t => t.AccountCodeNavigation.Type == "Expense")
            .GroupBy(t => t.AccountCode)
            .Select(g => new AccountGroupDTO(
                g.Key,
                g.First().AccountCodeNavigation.Name,
                g.First().AccountCodeNavigation.SubType,
                g.Sum(t => t.Debit - t.Credit)
            )).ToList();

        var totalRevenue = revenueGroups.Sum(r => r.Balance);
        var totalExpenses = expenseGroups.Sum(e => e.Balance);

        return new IncomeStatementDTO(
            revenueGroups, expenseGroups,
            totalRevenue, totalExpenses,
            NetIncome: totalRevenue - totalExpenses,
            from, to
        );
    }

    // ── Flujo de Efectivo ──
    // Filtra transacciones en cuentas de tipo Asset (efectivo/bancos)
    public async Task<CashFlowDTO> GetCashFlow(DateOnly from, DateOnly to)
    {
        var fromDate = from.ToDateTime(TimeOnly.MinValue);
        var toDate = to.ToDateTime(TimeOnly.MaxValue);

        var transactions = await _ctx.LedgerTransactions
            .Include(t => t.JournalEntry)
            .Include(t => t.AccountCodeNavigation)
            .Where(t => t.JournalEntry.Date >= fromDate && t.JournalEntry.Date <= toDate)
            .Where(t => t.AccountCodeNavigation.Type == "Asset")
            .ToListAsync();

        // Entradas: débitos a cuentas de activo (aumentan el efectivo)
        var inflows = transactions
            .Where(t => t.Debit > 0)
            .Select(t => new CashFlowItemDTO(
                t.JournalEntry.Memo,
                t.JournalEntry.Reference,
                t.JournalEntry.Date,
                t.Debit
            )).ToList();

        // Salidas: créditos a cuentas de activo (disminuyen el efectivo)
        var outflows = transactions
            .Where(t => t.Credit > 0)
            .Select(t => new CashFlowItemDTO(
                t.JournalEntry.Memo,
                t.JournalEntry.Reference,
                t.JournalEntry.Date,
                t.Credit
            )).ToList();

        var totalInflows = inflows.Sum(i => i.Amount);
        var totalOutflows = outflows.Sum(o => o.Amount);

        return new CashFlowDTO(
            inflows, outflows,
            totalInflows, totalOutflows,
            NetCashFlow: totalInflows - totalOutflows,
            from, to
        );
    }

    // ── Estado Financiero (resumen combinado) ──
    public async Task<FinancialSummaryDTO> GetFinancialSummary(DateOnly from, DateOnly to)
    {
        var balanceSheet = await GetBalanceSheet();
        var incomeStatement = await GetIncomeStatement(from, to);
        var cashFlow = await GetCashFlow(from, to);

        return new FinancialSummaryDTO(balanceSheet, incomeStatement, cashFlow);
    }
}
