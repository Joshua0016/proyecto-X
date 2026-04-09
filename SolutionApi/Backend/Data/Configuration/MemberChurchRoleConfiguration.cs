using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class MemberChurchRoleConfiguration : IEntityTypeConfiguration<MemberChurchRole>
{
    public void Configure(EntityTypeBuilder<MemberChurchRole> entity)
    {
        entity.HasKey(e => new { e.ChurchRoleId, e.MemberId }).HasName("memberChurchRole_pkey");
        entity.ToTable("memberChurchRole", "membership");

        entity.Property(e => e.ChurchRoleId).HasColumnName("churchRoleId");
        entity.Property(e => e.MemberId).HasColumnName("memberId");
        entity.Property(e => e.AssignedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp with time zone")
            .HasColumnName("assignedAt");

        entity.HasOne(d => d.ChurchRole)
            .WithMany(p => p.MemberChurchRoles)
            .HasForeignKey(d => d.ChurchRoleId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("memberChurchRole_churchRoleId_fkey");

        entity.HasOne(d => d.Member)
            .WithMany(p => p.MemberChurchRoles)
            .HasForeignKey(d => d.MemberId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("memberChurchRole_memberId_fkey");
    }
}
