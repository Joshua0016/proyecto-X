using Backend.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;


namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DonationItemTypeController(IDonationItemTypeService service) : ControllerBase
{
    [Authorize(Roles = "1")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await service.GetAllsAsync();
            return Ok(result);
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [Authorize(Roles = "1")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var result = await service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [Authorize(Roles = "1")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] DonationItemTypeCreateDTO donationItemType)
    {
        try

        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await service.AddAsync(donationItemType);
            return Ok(new { message = "Donation item type created successfully" });
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [Authorize(Roles = "1")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] DonationItemTypeResponseDTO donationItemType)
    {
        try
        {
            await service.UpdateAsync(donationItemType, id);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [Authorize(Roles = "1")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await service.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }



}