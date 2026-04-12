using Backend.Data;
using Backend.interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class EventRepository(DbProyectoXContext context) : IGenericRepository<Event>
{
    public async Task<IEnumerable<Event>> GetAllAsync() =>
        await context.Events
            .Include(e => e.OrganizerUser)
            .Include(e => e.Attendances)
            .ToListAsync();

    public async Task<Event?> GetByIdAsync(int id) =>
        await context.Events
            .Include(e => e.OrganizerUser)
            .Include(e => e.Attendances)
            .FirstOrDefaultAsync(e => e.EventId == id);

    public async Task AddAsync(Event entity)
    {
        await context.Events.AddAsync(entity);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Event entity)
    {
        context.Events.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            context.Events.Remove(entity);
            await context.SaveChangesAsync();
        }
    }

    public async Task DeleteAttendancesAsync(int eventId)
    {
        var attendances = await context.Attendances
            .Where(a => a.EventId == eventId)
            .ToListAsync();
        context.Attendances.RemoveRange(attendances);
        await context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Event>> SearchAsync(string query) =>
        await context.Events
            .Include(e => e.OrganizerUser)
            .Include(e => e.Attendances)
            .Where(e => e.Title.Contains(query) || e.Type.Contains(query))
            .ToListAsync();

    public Task<bool> ExistsAsync(string value) => Task.FromResult(false);
}
