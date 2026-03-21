using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration
{
    public class LedgerTransactionConfiguration : IEntityTypeConfiguration<LedgerTransaction>
    {
        public void Configure(EntityTypeBuilder<LedgerTransaction> entity)
        {
            entity.HasKey(e => e.TransactionId).HasName("ledgerTransaction_pkey");

            entity.ToTable("ledgerTransaction", "finances");

            entity.Property(e => e.TransactionId).UseIdentityAlwaysColumn().HasColumnName("transactionId");
            entity.Property(e => e.AccountCode).HasMaxLength(20).HasColumnName("accountCode");
            entity.Property(e => e.Credit).HasPrecision(12, 2).HasColumnName("credit");
            entity.Property(e => e.Debit).HasPrecision(12, 2).HasColumnName("debit");
            entity.Property(e => e.JournalEntryId).HasColumnName("journalEntryId");

            entity.HasOne(d => d.AccountCodeNavigation).WithMany(p => p.LedgerTransactions)
                .HasForeignKey(d => d.AccountCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ledgerTransaction_accountCode_fkey");

            entity.HasOne(d => d.JournalEntry).WithMany(p => p.LedgerTransactions)
                .HasForeignKey(d => d.JournalEntryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ledgerTransaction_journalEntryId_fkey");
        }
    }
}