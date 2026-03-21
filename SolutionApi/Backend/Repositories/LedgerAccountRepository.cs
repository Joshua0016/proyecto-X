using Backend.Data;
using Backend.interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class LedgerAccountRepository(DbProyectoXContext context) : IGenericRepository<LedgerAccount>
{
    public async Task<IEnumerable<LedgerAccount>> GetAllAsync() =>
        await context.LedgerAccounts.ToListAsync();

    public async Task<LedgerAccount?> GetByIdAsync(int id) => null; // PK is string

    public async Task<LedgerAccount?> GetByCodeAsync(string code) =>
        await context.LedgerAccounts.FindAsync(code);

    public async Task AddAsync(LedgerAccount entity)
    {
        await context.LedgerAccounts.AddAsync(entity);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(LedgerAccount entity)
    {
        context.LedgerAccounts.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id) { } // use DeleteByCodeAsync

    public async Task DeleteByCodeAsync(string code)
    {
        var entity = await GetByCodeAsync(code);
        if (entity != null)
        {
            context.LedgerAccounts.Remove(entity);
            await context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(string code) =>
        await context.LedgerAccounts.AnyAsync(a => a.AccountCode == code);
}
