using System;
using System.Collections.Generic;
using Backend.Models;
using Backend.Data;
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






    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DbProyectoXContext).Assembly);

    }
}
