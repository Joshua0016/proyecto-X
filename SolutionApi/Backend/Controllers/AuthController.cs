using Backend.Data;
using Backend.DTOs;
using Backend.Services;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;
        private readonly Backend.Data.ApplicationDbContext _context;

        public AuthController(IAuthService authService, Backend.Data.ApplicationDbContext context)
        {
            this.authService = authService;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await authService.AuthenticateAsync(request);

            if (response is null)
                return Unauthorized("Invalid email or password.");

            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {

            // validar si el email ya existe 
            if (await _context.Usuarios.AnyAsync(u => u.email == request.Email))
            {
                return BadRequest("Email already exists.");
            }

            //validar que el rol exista
            var rolExiste = await _context.Rols.AnyAsync(r => r.id_rol == request.IdRol);

            if (!rolExiste)
            {
                return BadRequest("Role does not exist.");
            }

            // crear el usuario y encriptar la contraseña

            var usuario1 = new usuario
            {
                email = request.Email,
                password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                id_rol = request.IdRol,
                fecha_creacion = DateTimeOffset.UtcNow
            };

            //guardar usuario en la base de datos
            _context.Usuarios.Add(usuario1);

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString()
                     ?? Request.Headers["X-Forwarded-For"].FirstOrDefault()
                     ?? "unknown";

            var log = new LogAuditorium
            {
                Timestamp = DateTimeOffset.UtcNow,
                Operacion = "Registro",
                TablaAfectada = "Usuarios",
                Detalle = $"Usuario {request.Email} registrado con exito",
                IpOrigen = ip,
                IdUsuarioNavigation = usuario1  // EF relaciona y usará el FK correcto
            };

            _context.LogAuditoria.Add(log);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Usuario registrado con éxito." });
        }
    }
}
