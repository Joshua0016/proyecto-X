using Backend.interfaces;
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
        return Ok(logs);
    }
}

