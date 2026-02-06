using System;
using System.Collections.Generic;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AsientoContable> AsientoContables { get; set; }

    public virtual DbSet<Asistencium> Asistencia { get; set; }

    public virtual DbSet<CuentaContable> CuentaContables { get; set; }

    public virtual DbSet<Donacion> Donacions { get; set; }

    public virtual DbSet<Evento> Eventos { get; set; }

    public virtual DbSet<FacturaGasto> FacturaGastos { get; set; }

    public virtual DbSet<Familium> Familia { get; set; }

    public virtual DbSet<LogAuditorium> LogAuditoria { get; set; }

    public virtual DbSet<Miembro> Miembros { get; set; }

    public virtual DbSet<MovimientoContable> MovimientoContables { get; set; }

    public virtual DbSet<Proveedor> Proveedors { get; set; }

    public virtual DbSet<ReciboFiscal> ReciboFiscals { get; set; }

    public virtual DbSet<Rol> Rols { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    //    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
    //        => optionsBuilder.UseNpgsql("Host=localhost;Database=projectxDB;Username=postgres;Password=1234");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AsientoContable>(entity =>
        {
            entity.HasKey(e => e.IdAsiento).HasName("asiento_contable_pkey");

            entity.ToTable("asiento_contable", "finanzas");

            entity.Property(e => e.IdAsiento)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id_asiento");
            entity.Property(e => e.Cuadrado)
                .HasDefaultValue(false)
                .HasColumnName("cuadrado");
            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("now()")
                .HasColumnName("fecha");
            entity.Property(e => e.Glosa).HasColumnName("glosa");
            entity.Property(e => e.IdUsuarioRegistrador).HasColumnName("id_usuario_registrador");
            entity.Property(e => e.Referencia)
                .HasMaxLength(50)
                .HasColumnName("referencia");

            entity.HasOne(d => d.IdUsuarioRegistradorNavigation).WithMany(p => p.AsientoContables)
                .HasForeignKey(d => d.IdUsuarioRegistrador)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("asiento_contable_id_usuario_registrador_fkey");
        });

        modelBuilder.Entity<Asistencium>(entity =>
        {
            entity.HasKey(e => e.IdAsistencia).HasName("asistencia_pkey");

            entity.ToTable("asistencia", "membresia");

            entity.Property(e => e.IdAsistencia)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id_asistencia");
            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("fecha");
            entity.Property(e => e.HoraEntrada).HasColumnName("hora_entrada");
            entity.Property(e => e.HoraSalida).HasColumnName("hora_salida");
            entity.Property(e => e.IdEvento).HasColumnName("id_evento");
            entity.Property(e => e.IdMiembro).HasColumnName("id_miembro");
            entity.Property(e => e.Presente).HasColumnName("presente");

            entity.HasOne(d => d.IdEventoNavigation).WithMany(p => p.Asistencia)
                .HasForeignKey(d => d.IdEvento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("asistencia_id_evento_fkey");

            entity.HasOne(d => d.IdMiembroNavigation).WithMany(p => p.Asistencia)
                .HasForeignKey(d => d.IdMiembro)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("asistencia_id_miembro_fkey");
        });

        modelBuilder.Entity<CuentaContable>(entity =>
        {
            entity.HasKey(e => e.CodigoCuenta).HasName("cuenta_contable_pkey");

            entity.ToTable("cuenta_contable", "finanzas");

            entity.Property(e => e.CodigoCuenta)
                .HasMaxLength(20)
                .HasColumnName("codigo_cuenta");
            entity.Property(e => e.Activa)
                .HasDefaultValue(true)
                .HasColumnName("activa");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .HasColumnName("nombre");
            entity.Property(e => e.SaldoActual)
                .HasPrecision(12, 2)
                .HasColumnName("saldo_actual");
            entity.Property(e => e.Subtipo)
                .HasMaxLength(50)
                .HasColumnName("subtipo");
            entity.Property(e => e.Tipo)
                .HasMaxLength(50)
                .HasColumnName("tipo");
        });

        modelBuilder.Entity<Donacion>(entity =>
        {
            entity.HasKey(e => e.IdDonacion).HasName("donacion_pkey");

            entity.ToTable("donacion", "finanzas");

            entity.Property(e => e.IdDonacion)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id_donacion");
            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .HasColumnName("estado");
            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("now()")
                .HasColumnName("fecha");
            entity.Property(e => e.IdMiembro).HasColumnName("id_miembro");
            entity.Property(e => e.MetodoPago)
                .HasMaxLength(50)
                .HasColumnName("metodo_pago");
            entity.Property(e => e.Monto)
                .HasPrecision(12, 2)
                .HasColumnName("monto");
            entity.Property(e => e.Tipo)
                .HasMaxLength(50)
                .HasColumnName("tipo");

            entity.HasOne(d => d.IdMiembroNavigation).WithMany(p => p.Donacions)
                .HasForeignKey(d => d.IdMiembro)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("donacion_id_miembro_fkey");
        });

        modelBuilder.Entity<Evento>(entity =>
        {
            entity.HasKey(e => e.IdEvento).HasName("evento_pkey");

            entity.ToTable("evento", "membresia");

            entity.Property(e => e.IdEvento)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id_evento");
            entity.Property(e => e.Descripcion).HasColumnName("descripcion");
            entity.Property(e => e.FechaFin).HasColumnName("fecha_fin");
            entity.Property(e => e.FechaInicio).HasColumnName("fecha_inicio");
            entity.Property(e => e.IdUsuarioOrganizador).HasColumnName("id_usuario_organizador");
            entity.Property(e => e.Tipo)
                .HasMaxLength(50)
                .HasColumnName("tipo");
            entity.Property(e => e.Titulo)
                .HasMaxLength(100)
                .HasColumnName("titulo");

            entity.HasOne(d => d.IdUsuarioOrganizadorNavigation).WithMany(p => p.Eventos)
                .HasForeignKey(d => d.IdUsuarioOrganizador)
                .HasConstraintName("evento_id_usuario_organizador_fkey");
        });

        modelBuilder.Entity<FacturaGasto>(entity =>
        {
            entity.HasKey(e => e.IdFacturaGasto).HasName("factura_gasto_pkey");

            entity.ToTable("factura_gasto", "finanzas");

            entity.Property(e => e.IdFacturaGasto)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id_factura_gasto");
            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .HasColumnName("estado");
            entity.Property(e => e.FechaEmision).HasColumnName("fecha_emision");
            entity.Property(e => e.FechaVencimiento).HasColumnName("fecha_vencimiento");
            entity.Property(e => e.IdAsiento).HasColumnName("id_asiento");
            entity.Property(e => e.IdProveedor).HasColumnName("id_proveedor");
            entity.Property(e => e.NumeroFactura)
                .HasMaxLength(50)
                .HasColumnName("numero_factura");
            entity.Property(e => e.Total)
                .HasPrecision(12, 2)
                .HasColumnName("total");

            entity.HasOne(d => d.IdAsientoNavigation).WithMany(p => p.FacturaGastos)
                .HasForeignKey(d => d.IdAsiento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("factura_gasto_id_asiento_fkey");

            entity.HasOne(d => d.IdProveedorNavigation).WithMany(p => p.FacturaGastos)
                .HasForeignKey(d => d.IdProveedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("factura_gasto_id_proveedor_fkey");
        });

        modelBuilder.Entity<Familium>(entity =>
        {
            entity.HasKey(e => e.IdFamilia).HasName("familia_pkey");

            entity.ToTable("familia", "membresia");

            entity.Property(e => e.IdFamilia)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id_familia");
            entity.Property(e => e.Direccion).HasColumnName("direccion");
            entity.Property(e => e.NombreFamilia)
                .HasMaxLength(100)
                .HasColumnName("nombre_familia");
            entity.Property(e => e.Telefono)
                .HasMaxLength(15)
                .HasColumnName("telefono");
        });

        modelBuilder.Entity<LogAuditorium>(entity =>
        {
            entity.HasKey(e => e.IdLog).HasName("log_auditoria_pkey");

            entity.ToTable("log_auditoria", "seguridad");

            entity.Property(e => e.IdLog)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id_log");
            entity.Property(e => e.Detalle).HasColumnName("detalle");
            entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");
            entity.Property(e => e.IpOrigen)
                .HasMaxLength(50)
                .HasColumnName("ip_origen");
            entity.Property(e => e.Operacion)
                .HasMaxLength(50)
                .HasColumnName("operacion");
            entity.Property(e => e.TablaAfectada)
                .HasMaxLength(100)
                .HasColumnName("tabla_afectada");
            entity.Property(e => e.Timestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("timestamp");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.LogAuditoria)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("log_auditoria_id_usuario_fkey");
        });

        modelBuilder.Entity<Miembro>(entity =>
        {
            entity.HasKey(e => e.IdMiembro).HasName("miembro_pkey");

            entity.ToTable("miembro", "membresia");

            entity.Property(e => e.IdMiembro)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id_miembro");
            entity.Property(e => e.Apellido)
                .HasMaxLength(50)
                .HasColumnName("apellido");
            entity.Property(e => e.FechaNacimiento).HasColumnName("fecha_nacimiento");
            entity.Property(e => e.FotoUrl).HasColumnName("foto_url");
            entity.Property(e => e.IdFamilia).HasColumnName("id_familia");
            entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .HasColumnName("nombre");

            entity.HasOne(d => d.IdFamiliaNavigation).WithMany(p => p.Miembros)
                .HasForeignKey(d => d.IdFamilia)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("miembro_id_familia_fkey");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Miembros)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("miembro_id_usuario_fkey");
        });

        modelBuilder.Entity<MovimientoContable>(entity =>
        {
            entity.HasKey(e => e.IdMovimiento).HasName("movimiento_contable_pkey");

            entity.ToTable("movimiento_contable", "finanzas");

            entity.Property(e => e.IdMovimiento)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id_movimiento");
            entity.Property(e => e.CodigoCuenta)
                .HasMaxLength(20)
                .HasColumnName("codigo_cuenta");
            entity.Property(e => e.Debe)
                .HasPrecision(12, 2)
                .HasColumnName("debe");
            entity.Property(e => e.Haber)
                .HasPrecision(12, 2)
                .HasColumnName("haber");
            entity.Property(e => e.IdAsiento).HasColumnName("id_asiento");

            entity.HasOne(d => d.CodigoCuentaNavigation).WithMany(p => p.MovimientoContables)
                .HasForeignKey(d => d.CodigoCuenta)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("movimiento_contable_codigo_cuenta_fkey");

            entity.HasOne(d => d.IdAsientoNavigation).WithMany(p => p.MovimientoContables)
                .HasForeignKey(d => d.IdAsiento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("movimiento_contable_id_asiento_fkey");
        });

        modelBuilder.Entity<Proveedor>(entity =>
        {
            entity.HasKey(e => e.IdProveedor).HasName("proveedor_pkey");

            entity.ToTable("proveedor", "finanzas");

            entity.Property(e => e.IdProveedor)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id_proveedor");
            entity.Property(e => e.Direccion).HasColumnName("direccion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .HasColumnName("nombre");
            entity.Property(e => e.Ruc)
                .HasMaxLength(20)
                .HasColumnName("ruc");
            entity.Property(e => e.Telefono)
                .HasMaxLength(12)
                .HasColumnName("telefono");
        });

        modelBuilder.Entity<ReciboFiscal>(entity =>
        {
            entity.HasKey(e => e.IdReciboFiscal).HasName("recibo_fiscal_pkey");

            entity.ToTable("recibo_fiscal", "finanzas");

            entity.HasIndex(e => e.Codigo, "recibo_fiscal_codigo_key").IsUnique();

            entity.Property(e => e.IdReciboFiscal)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id_recibo_fiscal");
            entity.Property(e => e.Codigo)
                .HasMaxLength(50)
                .HasColumnName("codigo");
            entity.Property(e => e.FechaEmision)
                .HasDefaultValueSql("now()")
                .HasColumnName("fecha_emision");
            entity.Property(e => e.IdDonacion).HasColumnName("id_donacion");

            entity.HasOne(d => d.IdDonacionNavigation).WithMany(p => p.ReciboFiscals)
                .HasForeignKey(d => d.IdDonacion)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("recibo_fiscal_id_donacion_fkey");
        });

        modelBuilder.Entity<Rol>(entity =>
        {
            entity.HasKey(e => e.IdRol).HasName("rol_pkey");

            entity.ToTable("rol", "seguridad");

            entity.Property(e => e.IdRol)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id_rol");
            entity.Property(e => e.Descripcion).HasColumnName("descripcion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario).HasName("usuario_pkey");

            entity.ToTable("usuario", "seguridad");

            entity.HasIndex(e => e.Email, "usuario_email_key").IsUnique();

            entity.Property(e => e.IdUsuario)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id_usuario");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .HasColumnName("email");
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("fecha_creacion");
            entity.Property(e => e.IdRol).HasColumnName("id_rol");
            entity.Property(e => e.Password).HasColumnName("password");

            entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.IdRol)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("usuario_id_rol_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
