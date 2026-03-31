using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class FamilyConfiguration : IEntityTypeConfiguration<Family>
{
    public void Configure(EntityTypeBuilder<Family> entity)
    {
        entity.HasKey(e => e.FamilyId).HasName("family_pkey");
        entity.ToTable("family", "membership");

        entity.Property(e => e.FamilyId).UseIdentityAlwaysColumn().HasColumnName("familyId");
        entity.Property(e => e.FamilyName).HasMaxLength(100).HasColumnName("familyName");
        entity.Property(e => e.District).HasMaxLength(100).HasColumnName("district");
        entity.Property(e => e.Sector).HasMaxLength(100).HasColumnName("sector");
        entity.Property(e => e.Address).HasColumnName("address");
        entity.Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp without time zone")
            .HasColumnName("createdAt");
    }
}
