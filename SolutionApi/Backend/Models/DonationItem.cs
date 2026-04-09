using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.commons;

namespace Backend.Models;

public partial class DonationItem
{
    [Key]
    public int DonationItemId { get; set; }

    [Required]
    public int DonationId { get; set; }

    [Required]
    public int DonationItemTypeId { get; set; }

    public int? Quantity { get; set; }

    public UnitOfMeasure? UnitOfMeasure { get; set; }

    [Required]
    [Column(TypeName = "decimal(12,2)")]
    public decimal Amount { get; set; }

    [Required]
    public PaymentMethod PaymentMethod { get; set; }

    public DonationStatus? Status { get; set; }

    public virtual Donation Donation { get; set; } = null!;

    public virtual DonationItemType DonationItemType { get; set; } = null!;
}
