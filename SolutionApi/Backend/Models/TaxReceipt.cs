using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public partial class TaxReceipt
{
    [Key]
    public int TaxReceiptId { get; set; }

    [Required(ErrorMessage = "El código del comprobante es obligatorio.")]
    [StringLength(20, MinimumLength = 5, ErrorMessage = "El código debe tener entre 5 y 20 caracteres.")]
    [RegularExpression(@"^[A-Z0-9]+$", ErrorMessage = "El código solo debe contener letras mayúsculas y números.")]
    public string Code { get; set; } = null!;

    [Required(ErrorMessage = "La fecha de emisión es obligatoria.")]
    [DataType(DataType.Date)]
    public DateTime IssueDate { get; set; }

    [Required(ErrorMessage = "La donación asociada es obligatoria.")]
    public int DonationId { get; set; }

    [ForeignKey("DonationId")]
    public virtual Donation Donation { get; set; } = null!;
}