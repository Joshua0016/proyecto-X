using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Vendor
{
    public int VendorId { get; set; }

    public string Name { get; set; } = null!;

    public string TaxId { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public virtual ICollection<ExpenseInvoice> ExpenseInvoices { get; set; } = new List<ExpenseInvoice>();
}
