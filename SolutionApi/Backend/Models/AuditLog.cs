using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class AuditLog
{
    public int LogId { get; set; }

    public DateTime? Timestamp { get; set; }

    public int UserId { get; set; }

    public string Operation { get; set; } = null!;

    public string AffectedTable { get; set; } = null!;

    public string Detail { get; set; } = null!;

    public string SourceIp { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
