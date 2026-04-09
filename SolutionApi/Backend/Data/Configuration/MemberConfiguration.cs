using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

public class MemberConfiguration : IEntityTypeConfiguration<Member>
{
    public void Configure(EntityTypeBuilder<Member> entity)
    {
        entity.HasKey(e => e.MemberId).HasName("member_pkey");
        entity.ToTable("member", "membership");

        // Primary key
        entity.Property(e => e.MemberId).UseIdentityAlwaysColumn().HasColumnName("memberId");

        // Identity fields
        entity.Property(e => e.NationalId).HasMaxLength(20).HasColumnName("nationalId");
        entity.Property(e => e.PassportNumber).HasMaxLength(20).HasColumnName("passportNumber");

        // Name fields
        entity.Property(e => e.FirstName).HasMaxLength(50).HasColumnName("firstName");
        entity.Property(e => e.SecondName).HasMaxLength(50).HasColumnName("secondName");
        entity.Property(e => e.LastName).HasMaxLength(50).HasColumnName("lastName");
        entity.Property(e => e.SecondLastName).HasMaxLength(50).HasColumnName("secondLastName");

        // Enum properties
        entity.Property(e => e.Gender).HasColumnName("gender");
        entity.Property(e => e.MaritalStatus).HasColumnName("maritalStatus");
        entity.Property(e => e.MemberType).HasColumnName("memberType");
        entity.Property(e => e.AcademicLevel).HasColumnName("academicLevel");

        // Personal info
        entity.Property(e => e.BirthDate).HasColumnName("birthDate");
        entity.Property(e => e.BirthPlace).HasMaxLength(50).HasColumnName("birthPlace");
        entity.Property(e => e.Nationality).HasMaxLength(50).HasColumnName("nationality");

        // Existing properties kept as-is
        entity.Property(e => e.PhotoUrl).HasColumnName("photoUrl");
        entity.Property(e => e.PhoneNumber).HasMaxLength(15).HasColumnName("phoneNumber");
        entity.Property(e => e.Email).HasMaxLength(150).HasColumnName("email");

        // Address and contact
        entity.Property(e => e.Address).HasColumnName("address");
        entity.Property(e => e.EmergencyContactName).HasMaxLength(100).HasColumnName("emergencyContactName");
        entity.Property(e => e.EmergencyContactPhone).HasMaxLength(15).HasColumnName("emergencyContactPhone");

        // Medical info
        entity.Property(e => e.MedicalCondition).HasColumnName("medicalCondition");
        entity.Property(e => e.BloodType).HasMaxLength(5).HasColumnName("bloodType");

        // Church membership info
        entity.Property(e => e.JoinDate).HasColumnName("joinDate");
        entity.Property(e => e.ConversionDate).HasColumnName("conversionDate");
        entity.Property(e => e.OriginChurch).HasMaxLength(100).HasColumnName("originChurch");
        entity.Property(e => e.DiscipleshipLevel).HasMaxLength(50).HasColumnName("discipleshipLevel");
        entity.Property(e => e.MemberSkills).HasColumnName("memberSkills");

        // Baptism info
        entity.Property(e => e.Baptized).HasDefaultValue(false).HasColumnName("baptized");
        entity.Property(e => e.BaptismDate).HasColumnName("baptismDate");
        entity.Property(e => e.BaptismPlace).HasMaxLength(100).HasColumnName("baptismPlace");

        // Boolean properties with defaults
        entity.Property(e => e.Discipline).HasDefaultValue(false).HasColumnName("discipline");
        entity.Property(e => e.CourtCase).HasDefaultValue(false).HasColumnName("courtCase");

        // Professional info
        entity.Property(e => e.Profession).HasMaxLength(100).HasColumnName("profession");
        entity.Property(e => e.Occupation).HasMaxLength(100).HasColumnName("occupation");
        entity.Property(e => e.MemberCourses).HasColumnName("memberCourses");

        // Timestamps
        entity.Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp with time zone")
            .HasColumnName("createdAt");
        entity.Property(e => e.UpdatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .HasColumnType("timestamp with time zone")
            .HasColumnName("updatedAt");

        // Foreign keys
        entity.Property(e => e.FamilyId).HasColumnName("familyId");
        entity.Property(e => e.SectorId).HasColumnName("sector");
        entity.Property(e => e.SmallGroupId).HasColumnName("smallGroupId");
        entity.Property(e => e.ChurchRoleId).HasColumnName("churchRoleId");

        // FK relationship: Family
        entity.HasOne(d => d.Family)
            .WithMany(p => p.Members)
            .HasForeignKey(d => d.FamilyId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("member_familyId_fkey")
            .IsRequired(false);

        // FK relationship: Sector
        entity.HasOne(d => d.Sector)
            .WithMany()
            .HasForeignKey(d => d.SectorId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("member_sector_fkey")
            .IsRequired(false);

        // FK relationship: SmallGroup
        entity.HasOne(d => d.SmallGroup)
            .WithMany()
            .HasForeignKey(d => d.SmallGroupId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("member_smallGroupId_fkey")
            .IsRequired(false);

        // FK relationship: ChurchRole
        entity.HasOne(d => d.ChurchRole)
            .WithMany()
            .HasForeignKey(d => d.ChurchRoleId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("member_churchRoleId_fkey")
            .IsRequired(false);
    }
}
