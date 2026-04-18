using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> entity)
    {
        entity.HasKey(e => e.LogId).HasName("auditLog_pkey");
        entity.ToTable("auditLog", "security");

        entity.Property(e => e.LogId).UseIdentityAlwaysColumn().HasColumnName("logId");
        entity.Property(e => e.Timestamp)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp with time zone")
            .HasColumnName("timestamp");
        entity.Property(e => e.UserId).HasColumnName("userId");
        entity.Property(e => e.Operation).HasMaxLength(50).HasColumnName("operation");
        entity.Property(e => e.AffectedTable).HasMaxLength(100).HasColumnName("affectedTable");
        entity.Property(e => e.EntityId).HasColumnName("entityId");
        entity.Property(e => e.OldValues).HasColumnName("oldValues");
        entity.Property(e => e.NewValues).HasColumnName("newValues");
        entity.Property(e => e.HttpMethod).HasMaxLength(10).HasColumnName("httpMethod");
        entity.Property(e => e.Endpoint).HasColumnName("endPoint");
        entity.Property(e => e.Detail).HasColumnName("detail");
        entity.Property(e => e.SourceIp).HasMaxLength(50).HasColumnName("sourceIp");

        entity.HasOne(d => d.User).WithMany(p => p.AuditLogs)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("auditLog_userId_fkey");
    }
}
