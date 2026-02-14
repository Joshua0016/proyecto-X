using Backend.Data;
using Backend.DTOs;
using Backend.Services;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;


namespace Backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class UserController(IService service) : ControllerBase
    {
        private readonly IService userService = service;





        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            try
            {
                var user = await userService.LoginAsync(request);

                return Ok(new
                {
                    id = user.id_usuario,
                    email = user.email,
                    idRol = user.id_rol,
                });
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
