using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration
{
    public class VendorConfiguration : IEntityTypeConfiguration<Vendor>
    {
        public void Configure(EntityTypeBuilder<Vendor> entity)
        {
            entity.HasKey(e => e.VendorId).HasName("vendor_pkey");

            entity.ToTable("vendor", "finances");

            entity.Property(e => e.VendorId).UseIdentityAlwaysColumn().HasColumnName("vendorId");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.Name).HasMaxLength(100).HasColumnName("name");
            entity.Property(e => e.PhoneNumber).HasMaxLength(12).HasColumnName("phoneNumber");
            entity.Property(e => e.TaxId).HasMaxLength(20).HasColumnName("taxId");
        }
    }
}
