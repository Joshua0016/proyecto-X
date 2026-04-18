using Backend.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "1")]
public class FinancialReportController(IFinancialReportService service) : ControllerBase
{
    /// <summary>
    /// Balance General — saldos actuales de todas las cuentas activas
    /// GET /api/FinancialReport/balance-sheet
    /// </summary>
    [HttpGet("balance-sheet")]
    public async Task<IActionResult> GetBalanceSheet()
    {
        var result = await service.GetBalanceSheet();
        return Ok(result);
    }

    /// <summary>
    /// Estado de Resultados — ingresos y gastos en un rango de fechas
    /// GET /api/FinancialReport/income-statement?from=2026-01-01&to=2026-12-31
    /// </summary>
    [HttpGet("income-statement")]
    public async Task<IActionResult> GetIncomeStatement(
        [FromQuery] DateOnly from, [FromQuery] DateOnly to)
    {
        if (from > to)
            return BadRequest(new { message = "La fecha 'from' no puede ser mayor que 'to'" });

        var result = await service.GetIncomeStatement(from, to);
        return Ok(result);
    }

    /// <summary>
    /// Flujo de Efectivo — entradas y salidas en cuentas de activo
    /// GET /api/FinancialReport/cash-flow?from=2026-01-01&to=2026-12-31
    /// </summary>
    [HttpGet("cash-flow")]
    public async Task<IActionResult> GetCashFlow(
        [FromQuery] DateOnly from, [FromQuery] DateOnly to)
    {
        if (from > to)
            return BadRequest(new { message = "La fecha 'from' no puede ser mayor que 'to'" });

        var result = await service.GetCashFlow(from, to);
        return Ok(result);
    }

    /// <summary>
    /// Estado Financiero completo — combina balance general + estado de resultados + flujo de efectivo
    /// GET /api/FinancialReport/summary?from=2026-01-01&to=2026-12-31
    /// </summary>
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(
        [FromQuery] DateOnly from, [FromQuery] DateOnly to)
    {
        if (from > to)
            return BadRequest(new { message = "La fecha 'from' no puede ser mayor que 'to'" });

        var result = await service.GetFinancialSummary(from, to);
        return Ok(result);
    }
}
