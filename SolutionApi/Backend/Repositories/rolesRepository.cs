using Backend.Repositories;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;


namespace Backend.Repositories;

public class rolesRepository(Backend.Data.ApplicationDbContext context) : IGenericRepository<rol>
{

    private readonly Backend.Data.ApplicationDbContext _context = context;


    public async Task<IEnumerable<rol>> GetAllAsync() =>
        await _context.Rols.ToListAsync();

    public async Task<rol?> GetByIdAsync(int id) =>
        await _context.Rols.FirstOrDefaultAsync(u => u.id_rol == id);


    public async Task AddAsync(rol rol)
    {
        if (rol == null) throw new ArgumentNullException(nameof(rol));

        await _context.Rols.AddAsync(rol);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var rol = await GetByIdAsync(id);
        if (rol != null)
        {
            _context.Rols.Remove(rol);
            await _context.SaveChangesAsync();
        }

    }

    public async Task UpdateAsync(rol rol)
    {
        if (rol == null) throw new ArgumentNullException(nameof(rol));
        _context.Rols.Update(rol);

        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(string nombre)
    {
        if (string.IsNullOrEmpty(nombre))
        {
            return false;
        }

        var normalizedEmail = nombre.ToLower();
        return await _context.Rols.AnyAsync(u => u.nombre.ToLower() == normalizedEmail);


    }







}
