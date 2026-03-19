using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration
{
    public class JournalEntryConfiguration : IEntityTypeConfiguration<JournalEntry>
    {
        public void Configure(EntityTypeBuilder<JournalEntry> entity)
        {
            entity.HasKey(e => e.JournalEntryId).HasName("journalEntry_pkey");

            entity.ToTable("journalEntry", "finances");

            entity.Property(e => e.JournalEntryId).UseIdentityAlwaysColumn().HasColumnName("journalEntryId");
            entity.Property(e => e.Date).HasDefaultValueSql("now()").HasColumnName("date");
            entity.Property(e => e.IsBalanced).HasDefaultValue(false).HasColumnName("isBalanced");
            entity.Property(e => e.Memo).HasColumnName("memo");
            entity.Property(e => e.RecordedByUserId).HasColumnName("recordedByUserId");
            entity.Property(e => e.Reference).HasMaxLength(50).HasColumnName("reference");

            entity.HasOne(d => d.RecordedByUser).WithMany(p => p.JournalEntries)
                .HasForeignKey(d => d.RecordedByUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("journalEntry_recordedByUserId_fkey");
        }
    }
}