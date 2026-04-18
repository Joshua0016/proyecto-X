using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.commons;

namespace Backend.Models;

public partial class ExpenseInvoice
{
    [Key]
    public int ExpenseInvoiceId { get; set; }

    [Required(ErrorMessage = "El proveedor es obligatorio.")]
    public int VendorId { get; set; }

    [Required(ErrorMessage = "El número de factura es obligatorio.")]
    [StringLength(50, ErrorMessage = "El número de factura no puede exceder los 50 caracteres.")]
    public string InvoiceNumber { get; set; } = null!;

    public string Description { get; set; } = string.Empty; // Nuevo



    [Required]
    [Range(0.01, 999999999.99, ErrorMessage = "El total debe ser mayor a cero.")]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }

    public PaymentMethod PaymentMethod { get; set; }  // Nuevo

    [Required(ErrorMessage = "La fecha de emisión es obligatoria.")]
    [DataType(DataType.Date)]
    public DateTime IssueDate { get; set; }

    [Required(ErrorMessage = "La fecha de vencimiento es obligatoria.")]
    [DataType(DataType.Date)]
    public DateTime DueDate { get; set; }

    [Required]
    [RegularExpression(@"^(Pending|Paid|Cancelled|Overdue)$",
        ErrorMessage = "El estado debe ser: Pendiente, Pagado, Cancelado o Vencido.")]
    public string Status { get; set; } = "Pending";

    [Required(ErrorMessage = "El asiento contable relacionado es obligatorio.")]
    public int JournalEntryId { get; set; }

    [ForeignKey("JournalEntryId")]
    public virtual JournalEntry JournalEntry { get; set; } = null!;

    [ForeignKey("VendorId")]
    public virtual Vendor Vendor { get; set; } = null!;
}