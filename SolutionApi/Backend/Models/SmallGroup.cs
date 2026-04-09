using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public partial class SmallGroup
{
    [Key]
    public int SmallGroupId { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<MemberSmallGroup> MemberSmallGroups { get; set; } = new List<MemberSmallGroup>();
}
