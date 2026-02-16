using Backend.DTOs;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;


namespace Backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class MembersController(IMemberService _service) : ControllerBase
    {
        private readonly IMemberService service = _service;

        [HttpGet("GetAll")] public async Task<IActionResult> GetAll() => Ok(await service.ListAll());

        [HttpPost("Create")]
        public async Task<IActionResult> Create(MemberCreateDTO dto)
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
            catch (Exception ex) { var errors = new List<string>(); var current = ex; while (current != null) { errors.Add(current.Message); current = current.InnerException; } return BadRequest(new { error = string.Join(" --> ", errors), stack = ex.StackTrace }); }

        }


        [HttpPost("{id}")]
        public async Task<IActionResult> Update(int id)
        {
            try { await service.Update(id); return Ok("Editado"); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await service.Delete(id); return Ok("Borrado");
        }

    }
}




