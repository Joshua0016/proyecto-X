using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class TaxReceipt
{
    public int TaxReceiptId { get; set; }

    public string Code { get; set; } = null!;

    public DateTime IssueDate { get; set; }

    public int DonationId { get; set; }

    public virtual Donation Donation { get; set; } = null!;
}
