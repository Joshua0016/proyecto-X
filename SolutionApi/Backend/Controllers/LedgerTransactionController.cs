using Backend.DTOs;
using Backend.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LedgerTransactionController(ILedgerTransactionService service) : ControllerBase
{
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll() => Ok(await service.ListAll());

    [HttpPost("Create/{journalEntryId}")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> Create(int journalEntryId, [FromBody] LedgerTransactionCreateDto dto)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await service.Persist(dto, journalEntryId);
            return Ok(new { message = "Transacción creada exitosamente" });
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await service.Delete(id);
            return Ok(new { message = "Transacción eliminada" });
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }
}
