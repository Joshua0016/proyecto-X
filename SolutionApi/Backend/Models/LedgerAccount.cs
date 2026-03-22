using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public partial class LedgerAccount
{
    [Key]
    [Required(ErrorMessage = "El código de cuenta es obligatorio.")]
    [StringLength(20, ErrorMessage = "El código no puede exceder los 20 caracteres.")]
    [RegularExpression(@"^[0-9.-]+$", ErrorMessage = "El código solo permite números, puntos y guiones.")]
    public string AccountCode { get; set; } = null!;

    [Required(ErrorMessage = "El nombre de la cuenta es obligatorio.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres.")]
    [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "El nombre solo debe contener letras.")]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = "El tipo de cuenta (Activo, Pasivo, etc.) es obligatorio.")]
    [RegularExpression(@"^(Asset|Liability|Equity|Revenue|Expense)$", 
        ErrorMessage = "El tipo debe ser: Activo, Pasivo, Patrimonio, Ingresos o Gastos.")]
    public string Type { get; set; } = null!;

    [Required(ErrorMessage = "El subtipo de cuenta es obligatorio.")]
    [StringLength(50, ErrorMessage = "El subtipo no puede exceder los 50 caracteres.")]
    public string SubType { get; set; } = null!;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal CurrentBalance { get; set; }

    public bool IsActive { get; set; } = true;

    public virtual ICollection<LedgerTransaction> LedgerTransactions { get; set; } = new List<LedgerTransaction>();
}