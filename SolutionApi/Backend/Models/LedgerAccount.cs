using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class LedgerAccount
{
    public string AccountCode { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Type { get; set; } = null!;

    public string SubType { get; set; } = null!;

    public decimal CurrentBalance { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<LedgerTransaction> LedgerTransactions { get; set; } = new List<LedgerTransaction>();
}
