using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class ChurchRoleConfiguration : IEntityTypeConfiguration<ChurchRole>
{
    public void Configure(EntityTypeBuilder<ChurchRole> entity)
    {
        entity.HasKey(e => e.ChurchRoleId).HasName("churchRole_pkey");

        entity.ToTable("churchRole", "membership");

        entity.Property(e => e.ChurchRoleId)
            .UseIdentityAlwaysColumn()
            .HasColumnName("churchRoleId");
        entity.Property(e => e.Description).HasColumnName("description");
        entity.Property(e => e.Name)
            .HasMaxLength(100)
            .HasColumnName("name");
    }
}
