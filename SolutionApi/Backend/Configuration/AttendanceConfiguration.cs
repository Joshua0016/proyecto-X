using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration
{
    public class AttendanceConfiguration : IEntityTypeConfiguration<Attendance>
    {
        public void Configure(EntityTypeBuilder<Attendance> entity)
        {
            entity.HasKey(e => e.AttendanceId).HasName("attendance_pkey");

            entity.ToTable("attendance", "membership");

            entity.Property(e => e.AttendanceId).UseIdentityAlwaysColumn().HasColumnName("attendanceId");
            entity.Property(e => e.Date).HasDefaultValueSql("CURRENT_DATE").HasColumnName("date");
            entity.Property(e => e.EntryTime).HasColumnName("entryTime");
            entity.Property(e => e.EventId).HasColumnName("eventId");
            entity.Property(e => e.ExitTime).HasColumnName("exitTime");
            entity.Property(e => e.IsPresent).HasColumnName("isPresent");
            entity.Property(e => e.MemberId).HasColumnName("memberId");

            entity.HasOne(d => d.Event).WithMany(p => p.Attendances)
                .HasForeignKey(d => d.EventId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("attendance_eventId_fkey");

            entity.HasOne(d => d.Member).WithMany(p => p.Attendances)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("attendance_memberId_fkey");
        }
    }
}