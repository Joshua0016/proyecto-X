using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly Backend.Data.ApplicationDbContext _Context;

        public RolesController(Backend.Data.ApplicationDbContext context)
        {
            _Context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<rol>>> GetRoles()
        {
            var roles = await _Context.Rols.
                Select(r => new rol
                {
                    id_rol = r.id_rol,
                    nombre = r.nombre,
                    descripcion = r.descripcion
                })
                .ToListAsync();
            return Ok(roles);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRoles([FromBody] RoleCreateDTO roleDTO)
        {
            if (string.IsNullOrWhiteSpace(roleDTO.Nombre))
                return BadRequest("El nombre del rol es obligatorio");


            var exist = await _Context.Rols.AnyAsync(r => r.nombre == roleDTO.Nombre);
            if (exist)
                return BadRequest("este rol ya se encuentra registrado");

            var nuevoRol = new rol
            {
                nombre = roleDTO.Nombre,
                descripcion = roleDTO.Descripcion
            };


            _Context.Rols.Add(nuevoRol);
            await _Context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRoles), new { id = nuevoRol.id_rol }, nuevoRol);

        }

    }
}
