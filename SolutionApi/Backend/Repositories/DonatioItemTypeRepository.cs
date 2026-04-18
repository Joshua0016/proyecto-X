using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Backend.interfaces;

namespace Backend.Repositories;


public class DonationItemTypeRepository(DbProyectoXContext context) : IGenericRepository<DonationItemType>
{

    public async Task<IEnumerable<DonationItemType>> GetAllAsync()
    {

        return await context.DonationItemTypes.ToListAsync();
    }

    public async Task<DonationItemType> GetByIdAsync(int id)
    {

        return await context.DonationItemTypes.FindAsync(id);
    }

    public async Task AddAsync(DonationItemType entity)
    {

        await context.DonationItemTypes.AddAsync(entity);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(DonationItemType entity)
    {

        context.DonationItemTypes.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {

        var entity = await context.DonationItemTypes.FindAsync(id);
        if (entity != null)
        {
            context.DonationItemTypes.Remove(entity);
            await context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(string name)
    {
        return await context.DonationItemTypes.AnyAsync(e => e.Name == name);
    }
}