using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class SmallGroupConfiguration : IEntityTypeConfiguration<SmallGroup>
{
    public void Configure(EntityTypeBuilder<SmallGroup> entity)
    {
        entity.HasKey(e => e.SmallGroupId).HasName("smallGroup_pkey");
        entity.ToTable("smallGroup", "membership");

        entity.Property(e => e.SmallGroupId).UseIdentityAlwaysColumn().HasColumnName("smallGroupId");
        entity.Property(e => e.Name).HasMaxLength(100).HasColumnName("name");
        entity.Property(e => e.Description).HasColumnName("description");
    }
}
