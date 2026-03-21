using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration
{
    public class EventConfiguration : IEntityTypeConfiguration<Event>
    {
        public void Configure(EntityTypeBuilder<Event> entity)
        {
            entity.HasKey(e => e.EventId).HasName("event_pkey");

            entity.ToTable("event", "membership");

            entity.Property(e => e.EventId).UseIdentityAlwaysColumn().HasColumnName("eventId");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.EndDate).HasColumnName("endDate");
            entity.Property(e => e.OrganizerUserId).HasColumnName("organizerUserId");
            entity.Property(e => e.StartDate).HasColumnName("startDate");
            entity.Property(e => e.Title).HasMaxLength(100).HasColumnName("title");
            entity.Property(e => e.Type).HasMaxLength(50).HasColumnName("type");

            entity.HasOne(d => d.OrganizerUser).WithMany(p => p.Events)
                .HasForeignKey(d => d.OrganizerUserId)
                .HasConstraintName("event_organizerUserId_fkey");
        }
    }
}