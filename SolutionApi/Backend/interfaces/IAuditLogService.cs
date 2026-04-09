using Backend.Models;

namespace Backend.interfaces;

public interface IAuditLogService
{
    Task Log(AuditLog entry);
    Task<IEnumerable<AuditLog>> GetAllAsync();
}
