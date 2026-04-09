using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services;

public class AuditLogService(AuditLogRepository repository) : IAuditLogService
{
    private readonly AuditLogRepository _repository = repository;

    public async Task Log(AuditLog entry)
    {
        await _repository.AddAsync(entry);
    }
}
