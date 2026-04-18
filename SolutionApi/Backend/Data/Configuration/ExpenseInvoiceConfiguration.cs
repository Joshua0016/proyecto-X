using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration
{
    public class ExpenseInvoiceConfiguration : IEntityTypeConfiguration<ExpenseInvoice>
    {
        public void Configure(EntityTypeBuilder<ExpenseInvoice> entity)
        {
            entity.HasKey(e => e.ExpenseInvoiceId).HasName("expenseInvoice_pkey");

            entity.ToTable("expenseInvoice", "finances");

            entity.Property(e => e.ExpenseInvoiceId).UseIdentityAlwaysColumn().HasColumnName("expenseInvoiceId");
            entity.Property(e => e.DueDate).HasColumnName("dueDate");
            entity.Property(e => e.InvoiceNumber).HasMaxLength(50).HasColumnName("invoiceNumber");
            entity.Property(e => e.Description).HasMaxLength(200).HasColumnName("description");
            entity.Property(e => e.Total).HasPrecision(12, 2).HasColumnName("total");
            entity.Property(e => e.PaymentMethod).HasColumnName("paymentMethod").HasColumnType("paymentmethodenum");
            entity.Property(e => e.IssueDate).HasColumnName("issueDate");
            entity.Property(e => e.JournalEntryId).HasColumnName("journalEntryId");
            entity.Property(e => e.Status).HasMaxLength(20).HasColumnName("status");
            entity.Property(e => e.VendorId).HasColumnName("vendorId");

            entity.HasOne(d => d.JournalEntry).WithMany(p => p.ExpenseInvoices)
                .HasForeignKey(d => d.JournalEntryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("expenseInvoice_journalEntryId_fkey");

            entity.HasOne(d => d.Vendor).WithMany(p => p.ExpenseInvoices)
                .HasForeignKey(d => d.VendorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("expenseInvoice_vendorId_fkey");
        }
    }
}