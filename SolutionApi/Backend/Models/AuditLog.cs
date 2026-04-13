using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class AuditLog
{
    public int LogId { get; set; }

    public string Operation { get; set; } = null!;

    public string AffectedTable { get; set; } = null!;

    public int? EntityId { get; set; }

    public string? OldValues { get; set; }

    public string? NewValues { get; set; }

    public string? HttpMethod { get; set; }

    public string? Endpoint { get; set; }

    public string? Detail { get; set; }

    public string? SourceIp { get; set; }

    public DateTime? Timestamp { get; set; }

    public int UserId { get; set; }

    public virtual User User { get; set; } = null!;
}
