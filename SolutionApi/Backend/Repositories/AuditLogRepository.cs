using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class AuditLogRepository(DbProyectoXContext context)
{
    private readonly DbProyectoXContext _context = context;

    public async Task AddAsync(AuditLog entry)
    {
        await _context.AuditLogs.AddAsync(entry);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetAllAsync()
    {
        return await _context.AuditLogs.Include(l => l.User).ToListAsync();
    }
}
