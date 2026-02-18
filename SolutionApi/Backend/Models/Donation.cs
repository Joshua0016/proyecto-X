using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Donation
{
    public int DonationId { get; set; }

    public int MemberId { get; set; }

    public decimal Amount { get; set; }

    public DateTime Date { get; set; }

    public string Type { get; set; } = null!;

    public string PaymentMethod { get; set; } = null!;

    public string Status { get; set; } = null!;

    public virtual Member Member { get; set; } = null!;

    public virtual ICollection<TaxReceipt> TaxReceipts { get; set; } = new List<TaxReceipt>();
}
