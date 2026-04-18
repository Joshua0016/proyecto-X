using Backend.DTOs;
using Backend.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LedgerAccountController(ILedgerAccountService service) : ControllerBase
{
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll() => Ok(await service.ListAll());

    [HttpPost("Create")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> Create([FromBody] LedgerAccountCreateDto dto)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await service.Persist(dto);
            return Ok(new { message = "Cuenta creada exitosamente" });
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpDelete("{accountCode}")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> Delete(string accountCode)
    {
        try
        {
            await service.Delete(accountCode);
            return Ok(new { message = "Cuenta eliminada" });
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }
}
