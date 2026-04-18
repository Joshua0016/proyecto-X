using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class DisciplinaryInfoConfiguration : IEntityTypeConfiguration<DisciplinaryInfo>
{
    public void Configure(EntityTypeBuilder<DisciplinaryInfo> entity)
    {
        entity.HasKey(e => e.DisciplinaryInfoId).HasName("disciplinaryInfo_pkey");
        entity.ToTable("disciplinaryInfo", "membership");

        entity.Property(e => e.DisciplinaryInfoId).UseIdentityAlwaysColumn().HasColumnName("disciplinaryInfoId");
        entity.Property(e => e.MemberId).HasColumnName("memberId");
        entity.Property(e => e.CaseDetails).HasColumnName("caseDetails");
        entity.Property(e => e.Status).HasMaxLength(50).HasColumnName("status");
        entity.Property(e => e.LastUpdated)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp with time zone")
            .HasColumnName("lastUpdated");

        entity.HasOne(d => d.Member)
            .WithMany(p => p.DisciplinaryInfos)
            .HasForeignKey(d => d.MemberId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("disciplinaryInfo_memberId_fkey");
    }
}
