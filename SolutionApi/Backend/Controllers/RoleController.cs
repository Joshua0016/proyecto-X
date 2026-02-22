
using Backend.interfaces;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;

public class RoleController(IRole service) : ControllerBase
{
    private readonly IRole service = service;

    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll() => Ok(await service.ListAll());

    [HttpPost("Create")]
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
