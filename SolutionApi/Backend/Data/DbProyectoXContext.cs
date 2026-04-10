using System;
using System.Collections.Generic;
using Backend.commons;
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

    public virtual DbSet<ChurchRole> ChurchRoles { get; set; }

    public virtual DbSet<CourtCaseInfo> CourtCaseInfos { get; set; }

    public virtual DbSet<DisciplinaryInfo> DisciplinaryInfos { get; set; }

    public virtual DbSet<Donation> Donations { get; set; }

    public virtual DbSet<DonationItem> DonationItems { get; set; }

    public virtual DbSet<DonationItemType> DonationItemTypes { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<ExpenseInvoice> ExpenseInvoices { get; set; }

    public virtual DbSet<Family> Families { get; set; }

    public virtual DbSet<JournalEntry> JournalEntries { get; set; }

    public virtual DbSet<LedgerAccount> LedgerAccounts { get; set; }

    public virtual DbSet<LedgerTransaction> LedgerTransactions { get; set; }

    public virtual DbSet<Member> Members { get; set; }

    public virtual DbSet<MemberChurchRole> MemberChurchRoles { get; set; }

    public virtual DbSet<MemberSmallGroup> MemberSmallGroups { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Sector> Sectors { get; set; }

    public virtual DbSet<SmallGroup> SmallGroups { get; set; }

    public virtual DbSet<TaxReceipt> TaxReceipts { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    public virtual DbSet<Vendor> Vendors { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Port=5433;Database=dbProyectoX;Username=admin;Password=123987456");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasPostgresEnum<AcademicLevel>("academiclevelenum")
            .HasPostgresEnum<CategoryItem>("categoryitemenum")
            .HasPostgresEnum<Gender>("genderenum")
            .HasPostgresEnum<MaritalStatus>("maritalstatusenum")
            .HasPostgresEnum<MemberType>("membertypeenum")
            .HasPostgresEnum<PaymentMethod>("paymentmethodenum")
            .HasPostgresEnum<DonationStatus>("statusenum")
            .HasPostgresEnum<UnitOfMeasure>("unitofmeasureenum");


        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DbProyectoXContext).Assembly);

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
