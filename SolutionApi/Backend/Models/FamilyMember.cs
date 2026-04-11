using System;
using System.ComponentModel.DataAnnotations;


namespace Backend.Models;

public partial class FamilyMember
{
    [Key]
    public int FamilyMemberId { get; set; }

    public int MemberId { get; set; }

    public int FamilyId { get; set; }

    [StringLength(50)]
    public string? Relationship { get; set; }

    // Navigation properties
    public virtual Member Member { get; set; } = null!;
    public virtual Family Family { get; set; } = null!;
}