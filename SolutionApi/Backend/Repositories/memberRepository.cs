using Backend.Models;
using Backend.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class MemberRepository(Backend.Data.ApplicationDbContext context) : IGenericRepository<Miembro>
{
    private readonly Backend.Data.ApplicationDbContext _context = context;

    protected readonly DbSet<Miembro> _dbSet = context.Miembros;

    public async Task<IEnumerable<Miembro>> GetAllAsync() => await _dbSet.ToListAsync();

    public async Task<Miembro?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);

    public async Task AddAsync(Miembro miembro)
    {
        await _dbSet.AddAsync(miembro);
        await _context.SaveChangesAsync();

    }

    public async Task UpdateAsync(Miembro miembro)
    {
        _dbSet.Update(miembro);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var miebro = await GetByIdAsync(id);
        if (miebro != null)
        {
            _dbSet.Remove(miebro);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(string telefono)
    {
        if (string.IsNullOrEmpty(telefono))
        {
            return false;
        }
        return await _context.Miembros.AnyAsync(u => u.Telefono == telefono);
    }


}







