using System.ComponentModel.DataAnnotations;
using Backend.commons;

namespace Backend.Models;

public partial class DonationItemType
{
    [Key]
    public int DonationItemTypeId { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Required]
    public CategoryItem Category { get; set; }

    public DateTime? CreatedAt { get; set; }
}
