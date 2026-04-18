using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class ChurchRole
{
    public int ChurchRoleId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<MemberChurchRole> MemberChurchRoles { get; set; } = new List<MemberChurchRole>();
}
