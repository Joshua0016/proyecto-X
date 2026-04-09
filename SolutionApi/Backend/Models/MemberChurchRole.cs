namespace Backend.Models;

public partial class MemberChurchRole
{
    public int ChurchRoleId { get; set; }

    public int MemberId { get; set; }

    public DateTime? AssignedAt { get; set; }

    public virtual ChurchRole ChurchRole { get; set; } = null!;

    public virtual Member Member { get; set; } = null!;
}
