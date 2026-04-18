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
        entity.Property(e => e.LastName).HasMaxLength(100).HasColumnName("lastName");
        entity.Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp without time zone")
            .HasColumnName("createdAt");
    }
}
