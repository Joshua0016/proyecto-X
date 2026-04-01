using Backend.DTOs;
using Backend.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IService userService, IJwtService jwtService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
    {
        try
        {
            var user = await userService.LoginAsync(request);
            var token = jwtService.GenerateToken(new LoginResponseDTO(
                UserId: user.UserId,
                Name: user.Name,
                Token: "",
                Email: user.Email,
                Rol: user.RoleId.ToString()
            ));

            return Ok(new LoginResponseDTO(
                UserId: user.UserId,
                Name: user.Name,
                Token: token,
                Email: user.Email,
                Rol: user.RoleId.ToString()
            ));
        }
        catch (UnauthorizedAccessException ex) { return Unauthorized(new { message = ex.Message }); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await userService.RegisterAsync(request);
            return Ok(new { message = "Usuario registrado exitosamente" });
        }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpGet]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> GetAll() => Ok(await userService.ListAllAsync());

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        try { return Ok(await userService.GetByIdAsync(id)); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UserUpdateDto dto)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await userService.UpdateAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    [HttpPut("{id}/change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDto dto)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await userService.ChangePasswordAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPut("{id}/deactivate")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> Deactivate(int id)
    {
        try
        {
            await userService.DeactivateAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }
}
