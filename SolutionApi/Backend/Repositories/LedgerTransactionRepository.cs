using Backend.Data;
using Backend.interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class LedgerTransactionRepository(DbProyectoXContext context) : IGenericRepository<LedgerTransaction>
{
    public async Task<IEnumerable<LedgerTransaction>> GetAllAsync() =>
        await context.LedgerTransactions
            .Include(t => t.JournalEntry)
            .Include(t => t.AccountCodeNavigation)
            .ToListAsync();

    public async Task<LedgerTransaction?> GetByIdAsync(int id) =>
        await context.LedgerTransactions.FindAsync(id);

    public async Task AddAsync(LedgerTransaction entity)
    {
        await context.LedgerTransactions.AddAsync(entity);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(LedgerTransaction entity)
    {
        context.LedgerTransactions.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            context.LedgerTransactions.Remove(entity);
            await context.SaveChangesAsync();
        }
    }

    public Task<bool> ExistsAsync(string value) =>
        Task.FromResult(false);
}
