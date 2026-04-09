using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public partial class AuditLog
{
    public int LogId { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public int UserId { get; set; }

    public string Operation { get; set; } = null!;
    public string AffectedTable { get; set; } = null!;

    public string? EntityId { get; set; }

    public string? OldValues { get; set; }

    public string? NewValues { get; set; }

    public string? HttpMethod { get; set; }
    public string? Endpoint { get; set; }
    public string? Detail { get; set; }
    public string SourceIp { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
