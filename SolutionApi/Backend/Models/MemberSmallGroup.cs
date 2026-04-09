namespace Backend.Models;

public partial class MemberSmallGroup
{
    public int SmallGroupId { get; set; }

    public int MemberId { get; set; }

    public DateTime? AssignedAt { get; set; }

    public virtual SmallGroup SmallGroup { get; set; } = null!;

    public virtual Member Member { get; set; } = null!;
}
