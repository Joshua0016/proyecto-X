﻿using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public partial class Family
{
    public int FamilyId { get; set; }
    public string LastName { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Member> Members { get; set; } = new List<Member>();
}

