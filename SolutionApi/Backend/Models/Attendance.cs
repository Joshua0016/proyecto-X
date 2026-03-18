using System;
using System.Collections.Generic;

namespace Backend.Models;


// Where are the validations
public partial class Attendance
{
    public int AttendanceId { get; set; }

    public int EventId { get; set; }

    public int MemberId { get; set; }

    public DateOnly Date { get; set; }

    public bool IsPresent { get; set; }

    public DateTime? EntryTime { get; set; }

    public DateTime? ExitTime { get; set; }

    public virtual Event Event { get; set; } = null!;

    public virtual Member Member { get; set; } = null!;
}
