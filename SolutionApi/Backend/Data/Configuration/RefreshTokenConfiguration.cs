using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> entity)
    {
        entity.HasKey(e => e.Id).HasName("refreshToken_pkey");

        entity.ToTable("refreshTokens", "security");

        entity.HasIndex(e => e.Token, "IX_refreshTokens_token");
        entity.HasIndex(e => e.UserId, "IX_refreshTokens_userId");

        entity.Property(e => e.Id).UseIdentityAlwaysColumn().HasColumnName("id");
        entity.Property(e => e.Token).HasMaxLength(256).HasColumnName("token");
        entity.Property(e => e.UserId).HasColumnName("userId");
        entity.Property(e => e.ExpiresAt)
            .HasColumnType("timestamp without time zone")
            .HasColumnName("expiresAt");
        entity.Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp without time zone")
            .HasColumnName("createdAt");
        entity.Property(e => e.IsRevoked)
            .HasDefaultValue(false)
            .HasColumnName("isRevoked");

        entity.HasOne(d => d.User).WithMany(p => p.RefreshTokens)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("refreshTokens_userId_fkey");
    }
}
