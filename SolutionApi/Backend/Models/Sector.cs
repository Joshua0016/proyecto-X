using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public partial class Sector
{
    [Key]
    public int SectorId { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [StringLength(100)]
    public string? District { get; set; }

    public DateTime? CreatedAt { get; set; }
}
