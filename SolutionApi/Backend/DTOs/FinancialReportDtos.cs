namespace Backend.DTOs;

// ── Balance General ──
public record BalanceSheetDTO(
    List<AccountGroupDTO> Assets,
    List<AccountGroupDTO> Liabilities,
    List<AccountGroupDTO> Equity,
    decimal TotalAssets,
    decimal TotalLiabilities,
    decimal TotalEquity,
    bool IsBalanced
);

// ── Estado de Resultados ──
public record IncomeStatementDTO(
    List<AccountGroupDTO> Revenue,
    List<AccountGroupDTO> Expenses,
    decimal TotalRevenue,
    decimal TotalExpenses,
    decimal NetIncome,
    DateOnly From,
    DateOnly To
);

// ── Flujo de Efectivo ──
public record CashFlowDTO(
    List<CashFlowItemDTO> Inflows,
    List<CashFlowItemDTO> Outflows,
    decimal TotalInflows,
    decimal TotalOutflows,
    decimal NetCashFlow,
    DateOnly From,
    DateOnly To
);

// ── Estado Financiero (resumen combinado) ──
public record FinancialSummaryDTO(
    BalanceSheetDTO BalanceSheet,
    IncomeStatementDTO IncomeStatement,
    CashFlowDTO CashFlow
);

// ── Auxiliares ──
public record AccountGroupDTO(
    string AccountCode,
    string AccountName,
    string SubType,
    decimal Balance
);

public record CashFlowItemDTO(
    string Description,
    string Reference,
    DateTime Date,
    decimal Amount
);
