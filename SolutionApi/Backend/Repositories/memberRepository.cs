using Backend.Models;
using Backend.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Backend.interfaces;

namespace Backend.Repositories;

public class MemberRepository(Backend.Data.DbProyectoXContext context) : IGenericRepository<Member>
{
    private readonly Backend.Data.DbProyectoXContext _context = context;

    protected readonly DbSet<Member> _dbSet = context.Members;

    public async Task<IEnumerable<Member>> GetAllAsync() => await _dbSet.ToListAsync();

    public async Task<Member?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);

    public async Task AddAsync(Member miembro)
    {
        await _dbSet.AddAsync(miembro);
        await _context.SaveChangesAsync();

    }

    public async Task UpdateAsync(Member miembro)
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
        return await _context.Members.AnyAsync(u => u.PhoneNumber == telefono);
    }
}
