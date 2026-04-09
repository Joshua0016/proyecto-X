using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> entity)
    {
        entity.HasKey(e => new { e.UserId, e.RoleId }).HasName("userRoles_pkey");

        entity.ToTable("userRoles", "security");

        entity.Property(e => e.UserId).HasColumnName("userId");
        entity.Property(e => e.RoleId).HasColumnName("roleId");
        entity.Property(e => e.AssignedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp without time zone")
            .HasColumnName("assignedAt");

        entity.HasOne(d => d.Role).WithMany(p => p.UserRoles)
            .HasForeignKey(d => d.RoleId)
            .HasConstraintName("fk_role");

        entity.HasOne(d => d.User).WithMany(p => p.UserRoles)
            .HasForeignKey(d => d.UserId)
            .HasConstraintName("fk_user");
    }
}
