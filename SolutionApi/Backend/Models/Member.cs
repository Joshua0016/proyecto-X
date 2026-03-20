using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public partial class Member
{
    public int MemberId { get; set; }

    [Required(ErrorMessage = "the Name is required")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "the name should be beetween 3 and 100 characters")]
    public string FirstName { get; set; } = null!;

    [Required(ErrorMessage = "the Name is required")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "the name should be beetween 3 and 100 characters")]
    public string LastName { get; set; } = null!;

    public string? PhotoUrl { get; set; }

    public DateTime BirthDate { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Email { get; set; }

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    public virtual ICollection<Donation> Donations { get; set; } = new List<Donation>();
}
