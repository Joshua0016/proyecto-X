using Backend.Data;
using Backend.interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class TaxReceiptRepository(DbProyectoXContext context) : IGenericRepository<TaxReceipt>
{
    public async Task<IEnumerable<TaxReceipt>> GetAllAsync() =>
        await context.TaxReceipts
            .Include(t => t.Donation)
                .ThenInclude(d => d.Member)
            .ToListAsync();

    public async Task<TaxReceipt?> GetByIdAsync(int id) =>
        await context.TaxReceipts
            .Include(t => t.Donation)
                .ThenInclude(d => d.Member)
            .FirstOrDefaultAsync(t => t.TaxReceiptId == id);

    public async Task<bool> ExistsByCodeAsync(string code) =>
        await context.TaxReceipts.AnyAsync(t => t.Code == code);

    public async Task<bool> DonationExistsAsync(int donationId) =>
        await context.Donations.AnyAsync(d => d.DonationId == donationId);

    public async Task AddAsync(TaxReceipt entity)
    {
        await context.TaxReceipts.AddAsync(entity);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(TaxReceipt entity)
    {
        context.TaxReceipts.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            context.TaxReceipts.Remove(entity);
            await context.SaveChangesAsync();
        }
    }

    public Task<bool> ExistsAsync(string value) =>
        context.TaxReceipts.AnyAsync(t => t.Code == value);
}
