using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace Backend.Models;

public partial class LedgerAccount
{
    public string AccountCode { get; set; } = null!;

    [Required(ErrorMessage = "the Name is required")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "the name should be beetween 3 and 100 characters")]

    public string Name { get; set; } = null!;

    public string Type { get; set; } = null!;

    public string SubType { get; set; } = null!;

    public decimal CurrentBalance { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<LedgerTransaction> LedgerTransactions { get; set; } = new List<LedgerTransaction>();
}
