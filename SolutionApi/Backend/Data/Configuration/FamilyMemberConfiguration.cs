


using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class FamilyMemberConfiguration : IEntityTypeConfiguration<FamilyMember>
{
    public void Configure(EntityTypeBuilder<FamilyMember> entity)
    {
        entity.HasKey(e => e.FamilyMemberId).HasName("familyMember_pkey");


        entity.ToTable("familyMember", "membership");

        entity.Property(e => e.FamilyMemberId).UseIdentityAlwaysColumn().HasColumnName("familyMemberId");
        entity.Property(e => e.MemberId).HasColumnName("memberId");
        entity.Property(e => e.FamilyId).HasColumnName("familyId");
        entity.Property(e => e.Relationship).HasMaxLength(50).HasColumnName("relationship");

        entity.HasOne(d => d.Member).WithMany(p => p.FamilyMembers)
            .HasForeignKey(d => d.MemberId)
            .HasConstraintName("fk_member");

        entity.HasOne(d => d.Family).WithMany(p => p.FamilyMembers)
            .HasForeignKey(d => d.FamilyId)
            .HasConstraintName("fk_family");
    }
}