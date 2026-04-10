using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class DonationItemTypeConfiguration : IEntityTypeConfiguration<DonationItemType>
{
    public void Configure(EntityTypeBuilder<DonationItemType> entity)
    {
        entity.HasKey(e => e.DonationItemTypeId).HasName("donationItemType_pkey");
        entity.ToTable("donationItemType", "finances");

        entity.Property(e => e.DonationItemTypeId).UseIdentityAlwaysColumn().HasColumnName("donationItemTypeId");
        entity.Property(e => e.Name).HasMaxLength(100).HasColumnName("name");
        entity.Property(e => e.Category).HasColumnName("category").HasColumnType("categoryitemenum");
        entity.Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp with time zone")
            .HasColumnName("createdAt");
    }
}
