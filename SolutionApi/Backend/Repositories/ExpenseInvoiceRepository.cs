using Backend.Data;
using Backend.interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class ExpenseInvoiceRepository(DbProyectoXContext context) : IGenericRepository<ExpenseInvoice>
{
    public async Task<IEnumerable<ExpenseInvoice>> GetAllAsync() =>
        await context.ExpenseInvoices
            .Include(e => e.Vendor)
            .Include(e => e.JournalEntry)
            .ToListAsync();

    public async Task<IEnumerable<ExpenseInvoice>> GetByVendorAsync(int vendorId) =>
        await context.ExpenseInvoices
            .Include(e => e.Vendor)
            .Include(e => e.JournalEntry)
            .Where(e => e.VendorId == vendorId)
            .ToListAsync();

    public async Task<ExpenseInvoice?> GetByIdAsync(int id) =>
        await context.ExpenseInvoices
            .Include(e => e.Vendor)
            .Include(e => e.JournalEntry)
            .FirstOrDefaultAsync(e => e.ExpenseInvoiceId == id);

    public async Task<bool> VendorExistsAsync(int vendorId) =>
        await context.Vendors.AnyAsync(v => v.VendorId == vendorId);

    public async Task<bool> JournalEntryExistsAsync(int journalEntryId) =>
        await context.JournalEntries.AnyAsync(j => j.JournalEntryId == journalEntryId);

    public async Task AddAsync(ExpenseInvoice entity)
    {
        await context.ExpenseInvoices.AddAsync(entity);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(ExpenseInvoice entity)
    {
        context.ExpenseInvoices.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            context.ExpenseInvoices.Remove(entity);
            await context.SaveChangesAsync();
        }
    }

    public Task<bool> ExistsAsync(string value) => Task.FromResult(false);
}
