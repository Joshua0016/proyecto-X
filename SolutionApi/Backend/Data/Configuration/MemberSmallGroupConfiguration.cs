using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class MemberSmallGroupConfiguration : IEntityTypeConfiguration<MemberSmallGroup>
{
    public void Configure(EntityTypeBuilder<MemberSmallGroup> entity)
    {
        entity.HasKey(e => new { e.SmallGroupId, e.MemberId }).HasName("memberSmallGroup_pkey");
        entity.ToTable("memberSmallGroup", "membership");

        entity.Property(e => e.SmallGroupId).HasColumnName("smallGroupId");
        entity.Property(e => e.MemberId).HasColumnName("memberId");
        entity.Property(e => e.AssignedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp with time zone")
            .HasColumnName("assignedAt");

        entity.HasOne(d => d.SmallGroup)
            .WithMany(p => p.MemberSmallGroups)
            .HasForeignKey(d => d.SmallGroupId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("memberSmallGroup_smallGroupId_fkey");

        entity.HasOne(d => d.Member)
            .WithMany(p => p.MemberSmallGroups)
            .HasForeignKey(d => d.MemberId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("memberSmallGroup_memberId_fkey");
    }
}
