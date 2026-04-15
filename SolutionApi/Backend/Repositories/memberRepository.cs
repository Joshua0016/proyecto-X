using Backend.Models;
using Backend.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Backend.interfaces;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Repositories;

public class MemberRepository(DbProyectoXContext context) : IGenericRepository<Member>
{
    private readonly DbProyectoXContext _context = context;


    public async Task<IEnumerable<Member>> GetAllAsync()
    {

        return await _context.Members
        .Where(u => u.IsActive)
        .ToListAsync();

    }

    public async Task<Member?> GetByIdAsync(int id) => await _context.Members.FindAsync(id);

    public async Task AddAsync(Member miembro)
    {
        await _context.AddAsync(miembro);
        await _context.SaveChangesAsync();

    }

    public async Task UpdateAsync(Member miembro)
    {
        _context.Update(miembro);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var miebro = await GetByIdAsync(id);
        if (miebro != null)
        {
            _context.Remove(miebro);
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
