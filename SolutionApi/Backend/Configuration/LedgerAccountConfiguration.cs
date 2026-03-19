using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration
{
    public class LedgerAccountConfiguration : IEntityTypeConfiguration<LedgerAccount>
    {
        public void Configure(EntityTypeBuilder<LedgerAccount> entity)
        {
            entity.HasKey(e => e.AccountCode).HasName("ledgerAccount_pkey");

            entity.ToTable("ledgerAccount", "finances");

            entity.Property(e => e.AccountCode).HasMaxLength(20).HasColumnName("accountCode");
            entity.Property(e => e.CurrentBalance).HasPrecision(12, 2).HasColumnName("currentBalance");
            entity.Property(e => e.IsActive).HasDefaultValue(true).HasColumnName("isActive");
            entity.Property(e => e.Name).HasMaxLength(100).HasColumnName("name");
            entity.Property(e => e.SubType).HasMaxLength(50).HasColumnName("subType");
            entity.Property(e => e.Type).HasMaxLength(50).HasColumnName("type");
        }
    }
}