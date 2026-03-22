using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;
public partial class JournalEntry
{
    [Key]
    public int JournalEntryId { get; set; }

    [Required(ErrorMessage = "La fecha del asiento es obligatoria.")]
    [DataType(DataType.Date)]
    public DateTime Date { get; set; }

    [Required(ErrorMessage = "El concepto o memo es obligatorio para la auditoría.")]
    [StringLength(500, ErrorMessage = "El memo no puede exceder los 500 caracteres.")]
    public string Memo { get; set; } = null!;

    [Required(ErrorMessage = "El número de referencia (comprobante) es obligatorio.")]
    [StringLength(50, ErrorMessage = "La referencia no puede exceder los 50 caracteres.")]
    public string Reference { get; set; } = null!;

    /// <summary>
    /// Indica si la suma de Débitos y Créditos es igual. 
    /// Se marca como true tras validar las LedgerTransactions asociadas.
    /// </summary>
    public bool? IsBalanced { get; set; } = false;

    [Required(ErrorMessage = "El usuario que registra el asiento es obligatorio.")]
    public int RecordedByUserId { get; set; }

    // Relaciones
    public virtual ICollection<ExpenseInvoice> ExpenseInvoices { get; set; } = new List<ExpenseInvoice>();

    [MinLength(2, ErrorMessage = "Un asiento contable debe tener al menos dos movimientos (Partida Doble).")]
    public virtual ICollection<LedgerTransaction> LedgerTransactions { get; set; } = new List<LedgerTransaction>();

    [ForeignKey("RecordedByUserId")]
    public virtual User RecordedByUser { get; set; } = null!;
}