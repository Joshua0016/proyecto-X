
using Backend.interfaces;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class RoleController(IRole service) : ControllerBase
{
    private readonly IRole service = service;

    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll() => Ok(await service.ListAll());

    [HttpPost("Create")]
    [Authorize(Roles = "1")] // Admin only
    public async Task<IActionResult> Create(RoleCreateDTO dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                // Devuelve los errores de validación para ver qué campo falla
                return BadRequest(ModelState);
            }

            await service.Persist(dto);
            return Ok(new { message = "success full" });
        }
        catch (Exception ex)
        {

            throw new Exception(ex.Message);
        }
    }

    [HttpPut("Update/{id}")]
    [Authorize(Roles = "1")] // Admin only
    public async Task<IActionResult> Update(int id)
    {
        try
        {
            await service.Update(id);
            return Ok("Editado");

        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("Delete/{id}")]
    [Authorize(Roles = "1")] // Admin only
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await service.Delete(id);
            return Ok("Borrado");

        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
