using Backend.DTOs;
using Backend.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JournalEntryController(IJournalEntryService service) : ControllerBase
{
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll() => Ok(await service.ListAll());

    [HttpPost("Create")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> Create([FromBody] JournalCreateDto dto)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await service.Persist(dto);
            return Ok(new { message = "Asiento contable creado exitosamente" });
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
            return Ok(new { message = "Asiento eliminado" });
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }
}
