using Backend.Repositories;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;


namespace Backend.Repositories;

public class rolesRepository(DbProyectoXContext context) : IGenericRepository<Role>
{

    private readonly DbProyectoXContext _context = context;


    public async Task<IEnumerable<Role>> GetAllAsync() =>
        await _context.Roles.ToListAsync();

    public async Task<Role?> GetByIdAsync(int id) =>
        await _context.Roles.FirstOrDefaultAsync(u => u.RoleId == id);


    public async Task AddAsync(Role rol)
    {
        if (rol == null) throw new ArgumentNullException(nameof(rol));

        await _context.Roles.AddAsync(rol);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var rol = await GetByIdAsync(id);
        if (rol != null)
        {
            _context.Roles.Remove(rol);
            await _context.SaveChangesAsync();
        }

    }

    public async Task UpdateAsync(Role rol)
    {
        if (rol == null) throw new ArgumentNullException(nameof(rol));
        _context.Roles.Update(rol);

        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(string nombre)
    {
        if (string.IsNullOrEmpty(nombre))
        {
            return false;
        }

        var normalizedName = nombre.ToLower();
        return await _context.Roles.AnyAsync(u => u.Name.ToLower() == normalizedName);
    }
}
