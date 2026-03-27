using Backend.DTOs;
using Backend.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DonationController(IDonationService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await service.ListAll());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try { return Ok(await service.GetById(id)); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpGet("member/{memberId}")]
    public async Task<IActionResult> GetByMember(int memberId) =>
        Ok(await service.ListByMember(memberId));

    [HttpPost]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> Create([FromBody] DonationCreateDto dto)
    {
        try
        {
            var id = await service.CreateDonation(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new { id, message = "Donación registrada exitosamente" });
        }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> Update(int id, [FromBody] DonationUpdateDto dto)
    {
        try
        {
            await service.Update(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return UnprocessableEntity(new { message = ex.Message }); }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await service.Delete(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }
}
