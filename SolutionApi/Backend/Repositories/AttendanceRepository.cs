using Backend.Data;
using Backend.interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class AttendanceRepository(DbProyectoXContext context) : IGenericRepository<Attendance>
{
    public async Task<IEnumerable<Attendance>> GetAllAsync() =>
        await context.Attendances
            .Include(a => a.Event)
            .Include(a => a.Member)
            .ToListAsync();

    public async Task<IEnumerable<Attendance>> GetByEventAsync(int eventId) =>
        await context.Attendances
            .Include(a => a.Event)
            .Include(a => a.Member)
            .Where(a => a.EventId == eventId)
            .ToListAsync();

    public async Task<IEnumerable<Attendance>> GetByMemberAsync(int memberId) =>
        await context.Attendances
            .Include(a => a.Event)
            .Include(a => a.Member)
            .Where(a => a.MemberId == memberId)
            .ToListAsync();

    public async Task<Attendance?> GetByIdAsync(int id) =>
        await context.Attendances
            .Include(a => a.Event)
            .Include(a => a.Member)
            .FirstOrDefaultAsync(a => a.AttendanceId == id);

    public async Task<bool> ExistsDuplicateAsync(int eventId, int memberId) =>
        await context.Attendances.AnyAsync(a => a.EventId == eventId && a.MemberId == memberId);

    public async Task<bool> ExistsDuplicateAsync(int eventId, int memberId, int excludeId) =>
        await context.Attendances.AnyAsync(a => a.EventId == eventId && a.MemberId == memberId && a.AttendanceId != excludeId);

    public async Task AddAsync(Attendance entity)
    {
        await context.Attendances.AddAsync(entity);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Attendance entity)
    {
        context.Attendances.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            context.Attendances.Remove(entity);
            await context.SaveChangesAsync();
        }
    }

    public Task<bool> ExistsAsync(string value) => Task.FromResult(false);
}
