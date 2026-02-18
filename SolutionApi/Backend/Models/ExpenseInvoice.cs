using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class ExpenseInvoice
{
    public int ExpenseInvoiceId { get; set; }

    public int VendorId { get; set; }

    public string InvoiceNumber { get; set; } = null!;

    public decimal Total { get; set; }

    public DateTime IssueDate { get; set; }

    public DateTime DueDate { get; set; }

    public string Status { get; set; } = null!;

    public int JournalEntryId { get; set; }

    public virtual JournalEntry JournalEntry { get; set; } = null!;

    public virtual Vendor Vendor { get; set; } = null!;
}
