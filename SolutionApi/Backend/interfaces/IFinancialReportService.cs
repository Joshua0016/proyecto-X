using Backend.DTOs;

namespace Backend.interfaces;

public interface IFinancialReportService
{
    Task<BalanceSheetDTO> GetBalanceSheet();
    Task<IncomeStatementDTO> GetIncomeStatement(DateOnly from, DateOnly to);
    Task<CashFlowDTO> GetCashFlow(DateOnly from, DateOnly to);
    Task<FinancialSummaryDTO> GetFinancialSummary(DateOnly from, DateOnly to);
}
