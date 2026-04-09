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
            entity.Property(e => e.Date)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnType("date")
                .HasColumnName("date");
            entity.Property(e => e.MemberId).HasColumnName("memberId");
            entity.Property(e => e.Observation).HasColumnName("observation");

            entity.HasOne(d => d.Member).WithMany(p => p.Donations)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("donation_memberId_fkey");
        }
    }
}
