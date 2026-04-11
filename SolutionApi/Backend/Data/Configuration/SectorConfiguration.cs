using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class SectorConfiguration : IEntityTypeConfiguration<Sector>
{
    public void Configure(EntityTypeBuilder<Sector> entity)
    {
        entity.HasKey(e => e.SectorId).HasName("sector_pkey");
        entity.ToTable("sector", "membership");

        entity.Property(e => e.SectorId).UseIdentityAlwaysColumn().HasColumnName("sectorId");
        entity.Property(e => e.Name).HasMaxLength(100).HasColumnName("name");
        entity.Property(e => e.District).HasMaxLength(100).HasColumnName("district");
        entity.Property(e => e.Municipio).HasColumnName("municipio");
        entity.Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp with time zone")
            .HasColumnName("createdAt");
    }
}
