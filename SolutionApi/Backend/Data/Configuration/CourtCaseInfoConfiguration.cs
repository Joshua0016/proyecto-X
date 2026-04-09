using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class CourtCaseInfoConfiguration : IEntityTypeConfiguration<CourtCaseInfo>
{
    public void Configure(EntityTypeBuilder<CourtCaseInfo> entity)
    {
        entity.HasKey(e => e.CourtCaseInfoId).HasName("courtCaseInfo_pkey");
        entity.ToTable("courtCaseInfo", "membership");

        entity.Property(e => e.CourtCaseInfoId).UseIdentityAlwaysColumn().HasColumnName("courtCaseInfoId");
        entity.Property(e => e.MemberId).HasColumnName("memberId");
        entity.Property(e => e.CaseDetails).HasColumnName("caseDetails");
        entity.Property(e => e.Status).HasMaxLength(50).HasColumnName("status");
        entity.Property(e => e.LastUpdated)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp with time zone")
            .HasColumnName("lastUpdated");

        entity.HasOne(d => d.Member)
            .WithMany(p => p.CourtCaseInfos)
            .HasForeignKey(d => d.MemberId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("courtCaseInfo_memberId_fkey");
    }
}
