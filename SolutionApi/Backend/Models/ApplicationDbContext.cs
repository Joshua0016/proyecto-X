using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<log_auditorium> log_auditoria { get; set; }

    public virtual DbSet<rol> rols { get; set; }

    public virtual DbSet<usuario> usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Database=projectxDB;Username=postgres;Password=1234");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<log_auditorium>(entity =>
        {
            entity.HasKey(e => e.id_log).HasName("log_auditoria_pkey");

            entity.ToTable("log_auditoria", "seguridad");

            entity.Property(e => e.id_log).UseIdentityAlwaysColumn();
            entity.Property(e => e.ip_origen).HasMaxLength(50);
            entity.Property(e => e.operacion).HasMaxLength(50);
            entity.Property(e => e.tabla_afectada).HasMaxLength(100);
            entity.Property(e => e.timestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.id_usuarioNavigation).WithMany(p => p.log_auditoria)
                .HasForeignKey(d => d.id_usuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("log_auditoria_id_usuario_fkey");
        });

        modelBuilder.Entity<rol>(entity =>
        {
            entity.HasKey(e => e.id_rol).HasName("rol_pkey");

            entity.ToTable("rol", "seguridad");

            entity.Property(e => e.id_rol).UseIdentityAlwaysColumn();
            entity.Property(e => e.nombre).HasMaxLength(50);
        });

        modelBuilder.Entity<usuario>(entity =>
        {
            entity.HasKey(e => e.id_usuario).HasName("usuario_pkey");

            entity.ToTable("usuario", "seguridad");

            entity.HasIndex(e => e.email, "usuario_email_key").IsUnique();

            entity.Property(e => e.id_usuario).UseIdentityAlwaysColumn();
            entity.Property(e => e.email).HasMaxLength(150);
            entity.Property(e => e.fecha_creacion).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.id_rolNavigation).WithMany(p => p.usuarios)
                .HasForeignKey(d => d.id_rol)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("usuario_id_rol_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
