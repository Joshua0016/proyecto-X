﻿using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public partial class Family
{
    public int FamilyId { get; set; }
    public string LastName { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<FamilyMember> FamilyMembers { get; set; } = new List<FamilyMember>();
}

