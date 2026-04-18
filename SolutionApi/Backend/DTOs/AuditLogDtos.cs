namespace Backend.DTOs;

public record AuditLogResponseDTO(
    int LogId,
    string Operation,
    string AffectedTable,
    int? EntityId,
    string? OldValues,
    string? NewValues,
    string? HttpMethod,
    string? Endpoint,
    string? Detail,
    string? SourceIp,
    DateTime? Timestamp,
    int UserId,
    string UserName
);
