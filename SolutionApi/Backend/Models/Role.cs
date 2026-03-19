using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Role
{
    public int RoleId { get; set; }

    [Required(ErrorMessage = "the Name is required")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "the name should be beetween 3 and 100 characters")]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
