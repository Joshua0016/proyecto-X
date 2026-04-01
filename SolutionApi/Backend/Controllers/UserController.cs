using Backend.Data;
using Backend.DTOs;
using Backend.Services;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Backend.interfaces;
using Microsoft.AspNetCore.Http.HttpResults;



namespace Backend.Controllers
{

    [ApiController]
    [Route("api/User")]
    public class UserController(IService service, IJwtService jwtService) : ControllerBase
    {
        private readonly IService userService = service;
        private readonly IJwtService _jwtService = jwtService;





        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            try
            {
                var user = await userService.LoginAsync(request);
                var token = _jwtService.GenerateToken(new LoginResponseDTO(
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
            catch (Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            try
            {
                await userService.RegisterAsync(request);
                return Ok(new { message = "User registered successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });

            }

        }




    }
}
