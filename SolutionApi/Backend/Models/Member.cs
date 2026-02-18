using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Member
{
    public int MemberId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? PhotoUrl { get; set; }

    public DateOnly BirthDate { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Email { get; set; }

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    public virtual ICollection<Donation> Donations { get; set; } = new List<Donation>();
}
