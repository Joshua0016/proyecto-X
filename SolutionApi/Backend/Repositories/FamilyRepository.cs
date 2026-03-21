using Backend.Models;
using Backend.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Backend.interfaces;


namespace Backend.Repositories;

public class FamilyRepository(DbProyectoXContext context) : IGenericRepository<Family>
{
    private readonly DbProyectoXContext _context = context;

    public async Task<IEnumerable<Family>> GetAllAsync() => await _context.Families.ToListAsync();

    public async Task<Family?> GetByIdAsync(int id) => await _context.Families.FindAsync(id);

    public async Task AddAsync(Family family)
    {
        await _context.Families.AddAsync(family);
        await _context.SaveChangesAsync();
    }


    public async Task UpdateAsync(Family family)
    {
        _context.Families.Update(family);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var family = await GetByIdAsync(id);
        if (family != null)
        {
            _context.Families.Remove(family);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(string telefono)
    {
        if (string.IsNullOrEmpty(telefono))
        {
            return false;
        }
        return await _context.Families.AnyAsync(u => u.PhoneNumber == telefono);
    }
}




