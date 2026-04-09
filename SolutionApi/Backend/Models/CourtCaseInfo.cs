using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public partial class CourtCaseInfo
{
    [Key]
    public int CourtCaseInfoId { get; set; }

    [Required]
    public int MemberId { get; set; }

    public string? CaseDetails { get; set; }

    [StringLength(50)]
    public string? Status { get; set; }

    public DateTime? LastUpdated { get; set; }

    public virtual Member Member { get; set; } = null!;
}
