using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class DonationItemConfiguration : IEntityTypeConfiguration<DonationItem>
{
    public void Configure(EntityTypeBuilder<DonationItem> entity)
    {
        entity.HasKey(e => e.DonationItemId).HasName("donationItem_pkey");
        entity.ToTable("donationItem", "finances");

        entity.Property(e => e.DonationItemId).UseIdentityAlwaysColumn().HasColumnName("donationItemId");
        entity.Property(e => e.DonationId).HasColumnName("donationId");
        entity.Property(e => e.DonationItemTypeId).HasColumnName("donationItemType");
        entity.Property(e => e.Quantity).HasColumnName("quantity");
        entity.Property(e => e.UnitOfMeasure).HasColumnName("unitOfMeasure");
        entity.Property(e => e.Amount).HasPrecision(12, 2).HasColumnName("amount");
        entity.Property(e => e.PaymentMethod).HasColumnName("paymentMethod");
        entity.Property(e => e.Status)
            .HasDefaultValue(Backend.commons.DonationStatus.Pendiente)
            .HasColumnName("status");

        entity.HasOne(d => d.Donation)
            .WithMany(p => p.DonationItems)
            .HasForeignKey(d => d.DonationId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("donationItem_donationId_fkey");

        entity.HasOne(d => d.DonationItemType)
            .WithMany()
            .HasForeignKey(d => d.DonationItemTypeId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("donationItem_donationItemType_fkey");
    }
}
