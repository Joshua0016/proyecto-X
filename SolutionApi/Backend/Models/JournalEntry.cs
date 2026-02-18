using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class JournalEntry
{
    public int JournalEntryId { get; set; }

    public DateTime Date { get; set; }

    public string Memo { get; set; } = null!;

    public string Reference { get; set; } = null!;

    public bool? IsBalanced { get; set; }

    public int RecordedByUserId { get; set; }

    public virtual ICollection<ExpenseInvoice> ExpenseInvoices { get; set; } = new List<ExpenseInvoice>();

    public virtual ICollection<LedgerTransaction> LedgerTransactions { get; set; } = new List<LedgerTransaction>();

    public virtual User RecordedByUser { get; set; } = null!;
}
