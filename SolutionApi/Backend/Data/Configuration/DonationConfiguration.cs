using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration
{
    public class DonationConfiguration : IEntityTypeConfiguration<Donation>
    {
        public void Configure(EntityTypeBuilder<Donation> entity)
        {
            entity.HasKey(e => e.DonationId).HasName("donation_pkey");

            entity.ToTable("donation", "finances");

            entity.Property(e => e.DonationId).UseIdentityAlwaysColumn().HasColumnName("donationId");
            entity.Property(e => e.Amount).HasPrecision(12, 2).HasColumnName("amount");
            entity.Property(e => e.Date).HasDefaultValueSql("now()").HasColumnName("date");
            entity.Property(e => e.MemberId).HasColumnName("memberId");
            entity.Property(e => e.PaymentMethod).HasMaxLength(50).HasColumnName("paymentMethod");
            entity.Property(e => e.Status).HasMaxLength(20).HasColumnName("status");
            entity.Property(e => e.Type).HasMaxLength(50).HasColumnName("type");

            entity.HasOne(d => d.Member).WithMany(p => p.Donations)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("donation_memberId_fkey");
        }
    }
}