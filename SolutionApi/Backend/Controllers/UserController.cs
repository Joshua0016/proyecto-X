using Backend.Data;
using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IService userService, IJwtService jwtService, DbProyectoXContext dbContext) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
    {
        try
        {
            var user = await userService.LoginAsync(request);
            var roleId = user.UserRoles.FirstOrDefault()?.RoleId.ToString() ?? "0";
            var token = jwtService.GenerateToken(new LoginResponseDTO(
                UserId: user.UserId,
                Name: user.Name,
                Token: "",
                RefreshToken: "",
                Email: user.Email,
                Rol: roleId
            ));

            var refreshTokenString = jwtService.GenerateRefreshToken();
            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshTokenString,
                UserId = user.UserId,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow,
                IsRevoked = false
            };
            dbContext.RefreshTokens.Add(refreshTokenEntity);
            await dbContext.SaveChangesAsync();

            return Ok(new LoginResponseDTO(
                UserId: user.UserId,
                Name: user.Name,
                Token: token,
                RefreshToken: refreshTokenString,
                Email: user.Email,
                Rol: roleId
            ));
        }
        catch (UnauthorizedAccessException ex) { return Unauthorized(new { message = ex.Message }); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto request)
    {
        try
        {
            var storedToken = await dbContext.RefreshTokens
                .Include(rt => rt.User)
                    .ThenInclude(u => u.UserRoles)
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

            if (storedToken == null || storedToken.IsRevoked || storedToken.ExpiresAt <= DateTime.UtcNow)
                return Unauthorized(new { message = "Refresh token inválido o expirado" });

            storedToken.IsRevoked = true;

            var roleId = storedToken.User.UserRoles.FirstOrDefault()?.RoleId.ToString() ?? "0";

            var newAccessToken = jwtService.GenerateToken(new LoginResponseDTO(
                UserId: storedToken.User.UserId,
                Name: storedToken.User.Name,
                Token: "",
                RefreshToken: "",
                Email: storedToken.User.Email,
                Rol: roleId
            ));

            var newRefreshTokenString = jwtService.GenerateRefreshToken();
            var newRefreshTokenEntity = new RefreshToken
            {
                Token = newRefreshTokenString,
                UserId = storedToken.UserId,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow,
                IsRevoked = false
            };

            dbContext.RefreshTokens.Add(newRefreshTokenEntity);
            await dbContext.SaveChangesAsync();

            return Ok(new { token = newAccessToken, refreshToken = newRefreshTokenString });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
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
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
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

    [HttpPut("{id}/activate")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> Activate(int id)
    {
        try
        {
            await userService.ActivateAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }
}
