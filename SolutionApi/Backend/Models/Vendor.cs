using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public partial class Vendor
{
    public int VendorId { get; set; }

    [Required(ErrorMessage = "the Name is required")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "the name should be beetween 3 and 100 characters")]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = "the Tax Id is required")]
    [RegularExpression(@"^\[A-Z&Ñ]{3,4}\d{6}[A\A-Z0-9]{3}",
    ErrorMessage = "the format of the tax id is invalid(Example: )")]
    public string TaxId { get; set; } = null!;

    [Required(ErrorMessage = "the Address is required")]
    [StringLength(100, MinimumLength = 10, ErrorMessage = "the address should contain exactly more tha 10 characters")]
    [RegularExpression(@"^[a-zA-Z0-9\s\s#.,-]+$", ErrorMessage = "the adrees have characteres not allowed")]

    public string Address { get; set; } = null!;

    [Required(ErrorMessage = "the Phone Number is required")]
    [Phone(ErrorMessage = "Format of Phone Number is invalid")]
    [RegularExpression(@"^\d{10}$", ErrorMessage = "the phone number should be 10 digits")]
    public string PhoneNumber { get; set; } = null!;

    public virtual ICollection<ExpenseInvoice> ExpenseInvoices { get; set; } = new List<ExpenseInvoice>();
}
