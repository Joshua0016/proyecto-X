using Backend.interfaces;
using Backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AuditLogController(IAuditLogService auditLogService) : ControllerBase
{
    private readonly IAuditLogService _auditLogService = auditLogService;

    [Authorize(Roles = "1")]
    [HttpGet]
    public async Task<IActionResult> GetAuditLogs()
    {
        var logs = await _auditLogService.GetAllAsync();
        var result = logs.Select(l => new AuditLogResponseDTO(
            l.LogId,
            l.Operation,
            l.AffectedTable,
            l.EntityId,
            l.OldValues,
            l.NewValues,
            l.HttpMethod,
            l.Endpoint,
            l.Detail,
            l.SourceIp,
            l.Timestamp,
            l.UserId,
            l.User?.Name ?? ""
        ));
        return Ok(result);
    }
}

