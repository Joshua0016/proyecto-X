using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public partial class Donation
{
    [Key]
    public int DonationId { get; set; }

    [Required(ErrorMessage = "El miembro es obligatorio.")]
    public int MemberId { get; set; }

    [Required(ErrorMessage = "La fecha de la donación es obligatoria.")]
    [DataType(DataType.Date)]
    public DateTime Date { get; set; }

    public string? Observation { get; set; }

    public virtual Member Member { get; set; } = null!;

    public virtual ICollection<DonationItem> DonationItems { get; set; } = new List<DonationItem>();

    public virtual ICollection<TaxReceipt> TaxReceipts { get; set; } = new List<TaxReceipt>();
}
