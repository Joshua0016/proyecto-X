using Backend.Data;
using Backend.interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class VendorRepository(DbProyectoXContext context) : IGenericRepository<Vendor>
{
    public async Task<IEnumerable<Vendor>> GetAllAsync() =>
        await context.Vendors
            .Include(v => v.ExpenseInvoices)
            .ToListAsync();

    public async Task<Vendor?> GetByIdAsync(int id) =>
        await context.Vendors
            .Include(v => v.ExpenseInvoices)
            .FirstOrDefaultAsync(v => v.VendorId == id);

    public async Task<bool> ExistsByTaxIdAsync(string taxId) =>
        await context.Vendors.AnyAsync(v => v.TaxId == taxId);

    public async Task<bool> ExistsByTaxIdAsync(string taxId, int excludeId) =>
        await context.Vendors.AnyAsync(v => v.TaxId == taxId && v.VendorId != excludeId);

    public async Task AddAsync(Vendor entity)
    {
        await context.Vendors.AddAsync(entity);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Vendor entity)
    {
        context.Vendors.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            context.Vendors.Remove(entity);
            await context.SaveChangesAsync();
        }
    }

    public Task<bool> ExistsAsync(string value) =>
        context.Vendors.AnyAsync(v => v.TaxId == value);
}
