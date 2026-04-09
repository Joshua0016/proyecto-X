using Backend.Data;
using Backend.interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class DonationRepository(DbProyectoXContext context) : IGenericRepository<Donation>
{
    public async Task<IEnumerable<Donation>> GetAllAsync() =>
        await context.Donations
            .Include(d => d.Member)
            .Include(d => d.DonationItems)
            .Include(d => d.TaxReceipts)
            .ToListAsync();

    public async Task<IEnumerable<Donation>> GetByMemberAsync(int memberId) =>
        await context.Donations
            .Include(d => d.Member)
            .Include(d => d.DonationItems)
            .Include(d => d.TaxReceipts)
            .Where(d => d.MemberId == memberId)
            .OrderByDescending(d => d.Date)
            .ToListAsync();

    public async Task<Donation?> GetByIdAsync(int id) =>
        await context.Donations
            .Include(d => d.Member)
            .Include(d => d.DonationItems)
            .Include(d => d.TaxReceipts)
            .FirstOrDefaultAsync(d => d.DonationId == id);

    public async Task AddAsync(Donation entity)
    {
        await context.Donations.AddAsync(entity);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Donation entity)
    {
        context.Donations.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            context.Donations.Remove(entity);
            await context.SaveChangesAsync();
        }
    }

    public Task<bool> ExistsAsync(string value) => Task.FromResult(false);
}
