using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public partial class Family
{
    public int FamilyId { get; set; }
    public string FamilyName { get; set; } = null!;
   
    public string? District { get; set; }
    public string? Sector { get; set; }
    public string? Address { get; set; }
    
    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Member> Members { get; set; } = new List<Member>();
}
