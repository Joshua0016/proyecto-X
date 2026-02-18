using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Family
{
    public int FamilyId { get; set; }

    public string FamilyName { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string? PhoneNumber { get; set; }
}
