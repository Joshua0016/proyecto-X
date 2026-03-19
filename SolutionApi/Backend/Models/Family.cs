using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Family
{
    public int FamilyId { get; set; }

    [Required(ErrorMessage = "the Family Name is required")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "the name should be beetween 3 and 100 characters")]
    public string FamilyName { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string? PhoneNumber { get; set; }
}
