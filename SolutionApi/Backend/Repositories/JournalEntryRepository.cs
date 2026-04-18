using Backend.Data;
using Backend.interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class JournalEntryRepository(DbProyectoXContext context) : IGenericRepository<JournalEntry>
{
    public async Task<IEnumerable<JournalEntry>> GetAllAsync() =>
        await context.JournalEntries
            .Include(j => j.LedgerTransactions)
            .ToListAsync();

    public async Task<JournalEntry?> GetByIdAsync(int id) =>
        await context.JournalEntries
            .Include(j => j.LedgerTransactions)
            .FirstOrDefaultAsync(j => j.JournalEntryId == id);

    public async Task AddAsync(JournalEntry entity)
    {
        await context.JournalEntries.AddAsync(entity);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(JournalEntry entity)
    {
        context.JournalEntries.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            context.JournalEntries.Remove(entity);
            await context.SaveChangesAsync();
        }
    }

    public Task<bool> ExistsAsync(string value) =>
        Task.FromResult(false);
}
