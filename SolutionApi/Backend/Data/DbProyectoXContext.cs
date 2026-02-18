using System;
using System.Collections.Generic;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public partial class DbProyectoXContext : DbContext
{
    public DbProyectoXContext()
    {
    }

    public DbProyectoXContext(DbContextOptions<DbProyectoXContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Attendance> Attendances { get; set; }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<Donation> Donations { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<ExpenseInvoice> ExpenseInvoices { get; set; }

    public virtual DbSet<Family> Families { get; set; }

    public virtual DbSet<JournalEntry> JournalEntries { get; set; }

    public virtual DbSet<LedgerAccount> LedgerAccounts { get; set; }

    public virtual DbSet<LedgerTransaction> LedgerTransactions { get; set; }

    public virtual DbSet<Member> Members { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<TaxReceipt> TaxReceipts { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Vendor> Vendors { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Attendance>(entity =>
        {
            entity.HasKey(e => e.AttendanceId).HasName("attendance_pkey");

            entity.ToTable("attendance", "membership");

            entity.Property(e => e.AttendanceId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("attendanceId");
            entity.Property(e => e.Date)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("date");
            entity.Property(e => e.EntryTime).HasColumnName("entryTime");
            entity.Property(e => e.EventId).HasColumnName("eventId");
            entity.Property(e => e.ExitTime).HasColumnName("exitTime");
            entity.Property(e => e.IsPresent).HasColumnName("isPresent");
            entity.Property(e => e.MemberId).HasColumnName("memberId");

            entity.HasOne(d => d.Event).WithMany(p => p.Attendances)
                .HasForeignKey(d => d.EventId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("attendance_eventId_fkey");

            entity.HasOne(d => d.Member).WithMany(p => p.Attendances)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("attendance_memberId_fkey");
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("auditLog_pkey");

            entity.ToTable("auditLog", "security");

            entity.Property(e => e.LogId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("logId");
            entity.Property(e => e.AffectedTable)
                .HasMaxLength(100)
                .HasColumnName("affectedTable");
            entity.Property(e => e.Detail).HasColumnName("detail");
            entity.Property(e => e.Operation)
                .HasMaxLength(50)
                .HasColumnName("operation");
            entity.Property(e => e.SourceIp)
                .HasMaxLength(50)
                .HasColumnName("sourceIp");
            entity.Property(e => e.Timestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("timestamp");
            entity.Property(e => e.UserId).HasColumnName("userId");

            entity.HasOne(d => d.User).WithMany(p => p.AuditLogs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("auditLog_userId_fkey");
        });

        modelBuilder.Entity<Donation>(entity =>
        {
            entity.HasKey(e => e.DonationId).HasName("donation_pkey");

            entity.ToTable("donation", "finances");

            entity.Property(e => e.DonationId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("donationId");
            entity.Property(e => e.Amount)
                .HasPrecision(12, 2)
                .HasColumnName("amount");
            entity.Property(e => e.Date)
                .HasDefaultValueSql("now()")
                .HasColumnName("date");
            entity.Property(e => e.MemberId).HasColumnName("memberId");
            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(50)
                .HasColumnName("paymentMethod");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .HasColumnName("type");

            entity.HasOne(d => d.Member).WithMany(p => p.Donations)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("donation_memberId_fkey");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("event_pkey");

            entity.ToTable("event", "membership");

            entity.Property(e => e.EventId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("eventId");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.EndDate).HasColumnName("endDate");
            entity.Property(e => e.OrganizerUserId).HasColumnName("organizerUserId");
            entity.Property(e => e.StartDate).HasColumnName("startDate");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .HasColumnName("title");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .HasColumnName("type");

            entity.HasOne(d => d.OrganizerUser).WithMany(p => p.Events)
                .HasForeignKey(d => d.OrganizerUserId)
                .HasConstraintName("event_organizerUserId_fkey");
        });

        modelBuilder.Entity<ExpenseInvoice>(entity =>
        {
            entity.HasKey(e => e.ExpenseInvoiceId).HasName("expenseInvoice_pkey");

            entity.ToTable("expenseInvoice", "finances");

            entity.Property(e => e.ExpenseInvoiceId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("expenseInvoiceId");
            entity.Property(e => e.DueDate).HasColumnName("dueDate");
            entity.Property(e => e.InvoiceNumber)
                .HasMaxLength(50)
                .HasColumnName("invoiceNumber");
            entity.Property(e => e.IssueDate).HasColumnName("issueDate");
            entity.Property(e => e.JournalEntryId).HasColumnName("journalEntryId");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
            entity.Property(e => e.Total)
                .HasPrecision(12, 2)
                .HasColumnName("total");
            entity.Property(e => e.VendorId).HasColumnName("vendorId");

            entity.HasOne(d => d.JournalEntry).WithMany(p => p.ExpenseInvoices)
                .HasForeignKey(d => d.JournalEntryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("expenseInvoice_journalEntryId_fkey");

            entity.HasOne(d => d.Vendor).WithMany(p => p.ExpenseInvoices)
                .HasForeignKey(d => d.VendorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("expenseInvoice_vendorId_fkey");
        });

        modelBuilder.Entity<Family>(entity =>
        {
            entity.HasKey(e => e.FamilyId).HasName("family_pkey");

            entity.ToTable("family", "membership");

            entity.Property(e => e.FamilyId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("familyId");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.FamilyName)
                .HasMaxLength(100)
                .HasColumnName("familyName");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(15)
                .HasColumnName("phoneNumber");
        });

        modelBuilder.Entity<JournalEntry>(entity =>
        {
            entity.HasKey(e => e.JournalEntryId).HasName("journalEntry_pkey");

            entity.ToTable("journalEntry", "finances");

            entity.Property(e => e.JournalEntryId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("journalEntryId");
            entity.Property(e => e.Date)
                .HasDefaultValueSql("now()")
                .HasColumnName("date");
            entity.Property(e => e.IsBalanced)
                .HasDefaultValue(false)
                .HasColumnName("isBalanced");
            entity.Property(e => e.Memo).HasColumnName("memo");
            entity.Property(e => e.RecordedByUserId).HasColumnName("recordedByUserId");
            entity.Property(e => e.Reference)
                .HasMaxLength(50)
                .HasColumnName("reference");

            entity.HasOne(d => d.RecordedByUser).WithMany(p => p.JournalEntries)
                .HasForeignKey(d => d.RecordedByUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("journalEntry_recordedByUserId_fkey");
        });

        modelBuilder.Entity<LedgerAccount>(entity =>
        {
            entity.HasKey(e => e.AccountCode).HasName("ledgerAccount_pkey");

            entity.ToTable("ledgerAccount", "finances");

            entity.Property(e => e.AccountCode)
                .HasMaxLength(20)
                .HasColumnName("accountCode");
            entity.Property(e => e.CurrentBalance)
                .HasPrecision(12, 2)
                .HasColumnName("currentBalance");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.SubType)
                .HasMaxLength(50)
                .HasColumnName("subType");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .HasColumnName("type");
        });

        modelBuilder.Entity<LedgerTransaction>(entity =>
        {
            entity.HasKey(e => e.TransactionId).HasName("ledgerTransaction_pkey");

            entity.ToTable("ledgerTransaction", "finances");

            entity.Property(e => e.TransactionId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("transactionId");
            entity.Property(e => e.AccountCode)
                .HasMaxLength(20)
                .HasColumnName("accountCode");
            entity.Property(e => e.Credit)
                .HasPrecision(12, 2)
                .HasColumnName("credit");
            entity.Property(e => e.Debit)
                .HasPrecision(12, 2)
                .HasColumnName("debit");
            entity.Property(e => e.JournalEntryId).HasColumnName("journalEntryId");

            entity.HasOne(d => d.AccountCodeNavigation).WithMany(p => p.LedgerTransactions)
                .HasForeignKey(d => d.AccountCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ledgerTransaction_accountCode_fkey");

            entity.HasOne(d => d.JournalEntry).WithMany(p => p.LedgerTransactions)
                .HasForeignKey(d => d.JournalEntryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ledgerTransaction_journalEntryId_fkey");
        });

        modelBuilder.Entity<Member>(entity =>
        {
            entity.HasKey(e => e.MemberId).HasName("member_pkey");

            entity.ToTable("member", "membership");

            entity.Property(e => e.MemberId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("memberId");
            entity.Property(e => e.BirthDate).HasColumnName("birthDate");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .HasColumnName("firstName");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .HasColumnName("lastName");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(10)
                .HasColumnName("phoneNumber");
            entity.Property(e => e.PhotoUrl).HasColumnName("photoUrl");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("role_pkey");

            entity.ToTable("role", "security");

            entity.HasIndex(e => e.Name, "role_name_key").IsUnique();

            entity.Property(e => e.RoleId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("roleId");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });

        modelBuilder.Entity<TaxReceipt>(entity =>
        {
            entity.HasKey(e => e.TaxReceiptId).HasName("taxReceipt_pkey");

            entity.ToTable("taxReceipt", "finances");

            entity.HasIndex(e => e.Code, "taxReceipt_code_key").IsUnique();

            entity.Property(e => e.TaxReceiptId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("taxReceiptId");
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .HasColumnName("code");
            entity.Property(e => e.DonationId).HasColumnName("donationId");
            entity.Property(e => e.IssueDate)
                .HasDefaultValueSql("now()")
                .HasColumnName("issueDate");

            entity.HasOne(d => d.Donation).WithMany(p => p.TaxReceipts)
                .HasForeignKey(d => d.DonationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("taxReceipt_donationId_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("user_pkey");

            entity.ToTable("user", "security");

            entity.HasIndex(e => e.Email, "user_email_key").IsUnique();

            entity.Property(e => e.UserId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("userId");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdAt");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .HasColumnName("email");
            entity.Property(e => e.Password).HasColumnName("password");
            entity.Property(e => e.RoleId).HasColumnName("roleId");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_roleId_fkey");
        });

        modelBuilder.Entity<Vendor>(entity =>
        {
            entity.HasKey(e => e.VendorId).HasName("vendor_pkey");

            entity.ToTable("vendor", "finances");

            entity.Property(e => e.VendorId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("vendorId");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(12)
                .HasColumnName("phoneNumber");
            entity.Property(e => e.TaxId)
                .HasMaxLength(20)
                .HasColumnName("taxId");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
