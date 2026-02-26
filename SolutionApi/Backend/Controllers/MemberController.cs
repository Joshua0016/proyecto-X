using Backend.DTOs;

using Microsoft.AspNetCore.Mvc;
using Backend.interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Authorization;


namespace Backend.Controllers
{

    [ApiController]
    [Route("api/Member")]
    [Authorize]
    public class MembersController(IMemberService _service) : ControllerBase
    {
        private readonly IMemberService service = _service;

        [HttpGet("GetAll")] public async Task<IActionResult> GetAll() => Ok(await service.ListAll());

        [HttpPost("Create")]
        [Authorize(Roles = "1")] // Admin only
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
        [Authorize(Roles = "1")] // Admin only
        public async Task<IActionResult> Update(int id, MemberUpdateDTO dto)
        {
            try { await service.Update(id, dto); return Ok("Editado"); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "1")] // Admin only
        public async Task<IActionResult> Delete(int id)
        {
            await service.Delete(id); return Ok("Borrado");
        }

    }
}




