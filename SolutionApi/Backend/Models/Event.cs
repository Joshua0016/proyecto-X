using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public partial class Event
{
    public int EventId { get; set; }

    [Required(ErrorMessage = "the Title is required")]
    public string Title { get; set; } = null!;

    public string Type { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int? OrganizerUserId { get; set; }

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    public virtual User? OrganizerUser { get; set; }
}
