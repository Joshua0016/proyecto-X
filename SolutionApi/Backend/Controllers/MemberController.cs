using Backend.DTOs;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;


namespace Backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class MembersController(IMemberService service) : ControllerBase
    {
        [HttpGet] public async Task<IActionResult> GetAll() => Ok(await service.ListAll());

        [HttpPost]
        public async Task<IActionResult> Create(MemberCreateDTO dto)
        {
            try { await service.Persist(dto); return Ok("Registrado"); }
            catch (Exception ex) { return BadRequest(ex.Message); }
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




