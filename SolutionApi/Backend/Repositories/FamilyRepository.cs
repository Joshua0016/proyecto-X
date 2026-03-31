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
        await _context.Families.Include(f => f.Members).ToListAsync();

    public async Task<Family?> GetByIdAsync(int id) =>
        await _context.Families.Include(f => f.Members).FirstOrDefaultAsync(f => f.FamilyId == id);

    public async Task<IEnumerable<Family>> SearchAsync(string? lastName, string? memberName)
    {
        var query = _context.Families.Include(f => f.Members).AsQueryable();

        if (!string.IsNullOrWhiteSpace(lastName))
            query = query.Where(f => f.LastName.ToLower().Contains(lastName.ToLower()));

        if (!string.IsNullOrWhiteSpace(memberName))
            query = query.Where(f => f.Members.Any(m =>
                m.FirstName.ToLower().Contains(memberName.ToLower()) ||
                m.LastName.ToLower().Contains(memberName.ToLower())));

        return await query.ToListAsync();
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

    public async Task<bool> ExistsAsync(string sector)
    {
        if (string.IsNullOrEmpty(sector))
        {
            return false;
        }
        return await _context.Families.AnyAsync(u => u.Sector == sector);
    }

    public async Task<List<Member>> GetByIdsAsync(List<int> memberIds)
    {
        return await _context.Members.Where(m => memberIds.Contains(m.MemberId)).ToListAsync();
    }
}




