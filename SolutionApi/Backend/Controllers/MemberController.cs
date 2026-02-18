using Backend.DTOs;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;


namespace Backend.Controllers
{

    [ApiController]
    [Route("api/Member")]
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
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

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




