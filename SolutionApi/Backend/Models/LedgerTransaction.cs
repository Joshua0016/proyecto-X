using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class LedgerTransaction
{
    public int TransactionId { get; set; }

    public int JournalEntryId { get; set; }

    public string AccountCode { get; set; } = null!;

    public decimal Debit { get; set; }

    public decimal Credit { get; set; }

    public virtual LedgerAccount AccountCodeNavigation { get; set; } = null!;

    public virtual JournalEntry JournalEntry { get; set; } = null!;
}
