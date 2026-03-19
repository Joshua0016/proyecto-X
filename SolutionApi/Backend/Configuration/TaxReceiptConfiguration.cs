using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration
{
    public class TaxReceiptConfiguration : IEntityTypeConfiguration<TaxReceipt>
    {
        public void Configure(EntityTypeBuilder<TaxReceipt> entity)
        {
            entity.HasKey(e => e.TaxReceiptId).HasName("taxReceipt_pkey");

            entity.ToTable("taxReceipt", "finances");

            entity.HasIndex(e => e.Code, "taxReceipt_code_key").IsUnique();

            entity.Property(e => e.TaxReceiptId).UseIdentityAlwaysColumn().HasColumnName("taxReceiptId");
            entity.Property(e => e.Code).HasMaxLength(50).HasColumnName("code");
            entity.Property(e => e.DonationId).HasColumnName("donationId");
            entity.Property(e => e.IssueDate).HasDefaultValueSql("now()").HasColumnName("issueDate");

            entity.HasOne(d => d.Donation).WithMany(p => p.TaxReceipts)
                .HasForeignKey(d => d.DonationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("taxReceipt_donationId_fkey");
        }
    }
}