using Backend.Models;
using Backend.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Backend.interfaces;


namespace Backend.Repositories;

public class FamilyRepository(DbProyectoXContext context) : IGenericRepository<Family>
{
    private readonly DbProyectoXContext _context = context;

    public async Task<IEnumerable<Family>> GetAllAsync() =>
        await _context.Families.Include(f => f.FamilyMembers).ThenInclude(fm => fm.Member).ToListAsync();

    public async Task<Family?> GetByIdAsync(int id) =>
        await _context.Families.Include(f => f.FamilyMembers).ThenInclude(fm => fm.Member).FirstOrDefaultAsync(f => f.FamilyId == id);

    public async Task<IEnumerable<Family>> SearchAsync(string? query)
    {
        var dbQuery = _context.Families.Include(f => f.FamilyMembers).ThenInclude(fm => fm.Member).AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
        {
            var lowerQuery = query.ToLower();
            dbQuery = dbQuery.Where(f =>
                f.LastName.ToLower().Contains(lowerQuery) ||
                f.FamilyMembers.Any(fm =>
                    fm.Member != null && (
                        fm.Member.FirstName.ToLower().Contains(lowerQuery) ||
                        fm.Member.LastName.ToLower().Contains(lowerQuery))));
        }

        return await dbQuery.ToListAsync();
    }

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

    public async Task<bool> ExistsAsync(string lastName)
    {
        if (string.IsNullOrEmpty(lastName))
        {
            return false;
        }
        return await _context.Families.AnyAsync(f => f.LastName == lastName);
    }
}




