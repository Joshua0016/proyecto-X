using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;


public partial class LedgerTransaction
{
    [Key]
    public int TransactionId { get; set; }

    [Required(ErrorMessage = "La entrada de diario relacionada es obligatoria.")]
    public int JournalEntryId { get; set; }

    [Required(ErrorMessage = "El código de cuenta es obligatorio.")]
    [StringLength(20, ErrorMessage = "El código de cuenta no puede exceder los 20 caracteres.")]
    [RegularExpression(@"^[0-9.-]+$", ErrorMessage = "El código de cuenta solo debe contener números, puntos o guiones.")]
    public string AccountCode { get; set; } = null!;

    [Required]
    [Range(0, 999999999999.99, ErrorMessage = "El débito debe ser un valor positivo.")]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Debit { get; set; }

    [Required]
    [Range(0, 999999999999.99, ErrorMessage = "El crédito debe ser un valor positivo.")]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Credit { get; set; }

    [ForeignKey("AccountCode")]
    public virtual LedgerAccount AccountCodeNavigation { get; set; } = null!;

    [ForeignKey("JournalEntryId")]
    public virtual JournalEntry JournalEntry { get; set; } = null!;
}