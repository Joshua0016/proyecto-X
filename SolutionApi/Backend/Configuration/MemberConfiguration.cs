using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration
{
    public class MemberConfiguration : IEntityTypeConfiguration<Member>
    {
        public void Configure(EntityTypeBuilder<Member> entity)
        {
            entity.HasKey(e => e.MemberId).HasName("member_pkey");

            entity.ToTable("member", "membership");

            entity.Property(e => e.MemberId).UseIdentityAlwaysColumn().HasColumnName("memberId");
            entity.Property(e => e.BirthDate).HasColumnName("birthDate");
            entity.Property(e => e.Email).HasMaxLength(50).HasColumnName("email");
            entity.Property(e => e.FirstName).HasMaxLength(50).HasColumnName("firstName");
            entity.Property(e => e.LastName).HasMaxLength(50).HasColumnName("lastName");
            entity.Property(e => e.PhoneNumber).HasMaxLength(10).HasColumnName("phoneNumber");
            entity.Property(e => e.PhotoUrl).HasColumnName("photoUrl");
        }
    }
}