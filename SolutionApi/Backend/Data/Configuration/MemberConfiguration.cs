using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class MemberConfiguration : IEntityTypeConfiguration<Member>
{
    public void Configure(EntityTypeBuilder<Member> entity)
    {
        entity.HasKey(e => e.MemberId).HasName("member_pkey");
        entity.ToTable("member", "membership");

        entity.Property(e => e.MemberId).UseIdentityAlwaysColumn().HasColumnName("memberId");
        entity.Property(e => e.FirstName).HasMaxLength(50).HasColumnName("firstName");
        entity.Property(e => e.LastName).HasMaxLength(50).HasColumnName("lastName");
        entity.Property(e => e.PhotoUrl).HasColumnName("photoUrl");
        entity.Property(e => e.BirthDate).HasColumnName("birthDate");
        entity.Property(e => e.PhoneNumber).HasMaxLength(15).HasColumnName("phoneNumber");
        entity.Property(e => e.Email).HasMaxLength(150).HasColumnName("email");
        entity.Property(e => e.FamilyId).HasColumnName("familyId");

        entity.HasOne(d => d.Family)
            .WithMany(p => p.Members)
            .HasForeignKey(d => d.FamilyId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("member_familyId_fkey");
    }
}
