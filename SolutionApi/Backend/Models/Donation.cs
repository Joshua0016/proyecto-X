using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public partial class Donation
{
    [Key]
    public int DonationId { get; set; }

    [Required(ErrorMessage = "El miembro es obligatorio.")]
    public int MemberId { get; set; }

    [Required]
    [Range(0.01, 999999999.99, ErrorMessage = "El monto de la donación debe ser mayor a cero.")]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "La fecha de la donación es obligatoria.")]
    [DataType(DataType.Date)]
    public DateTime Date { get; set; }

    [Required(ErrorMessage = "El tipo de donación es obligatorio.")]
    [StringLength(50, ErrorMessage = "El tipo no puede exceder los 50 caracteres.")]
    // Ej: Diezmo, Ofrenda, Campaña Especial
    public string Type { get; set; } = null!;

    [Required(ErrorMessage = "El método de pago es obligatorio.")]
    [RegularExpression(@"^(Cash|Transfer|Check|CreditCard|DebitCard)$",
        ErrorMessage = "Método de pago no válido.")]
    public string PaymentMethod { get; set; } = null!;

    [Required]
    [RegularExpression(@"^(Pending|Completed|Cancelled)$",
        ErrorMessage = "El estado debe ser: Pendiente, Completado o Cancelado.")]
    public string Status { get; set; } = "Completed";

    [ForeignKey("MemberId")]
    public virtual Member Member { get; set; } = null!;

    public virtual ICollection<TaxReceipt> TaxReceipts { get; set; } = new List<TaxReceipt>();
}