using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public partial class Vendor
{
    public int VendorId { get; set; }

    [Required(ErrorMessage = "El nombre es requerido")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres.")]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = "El RNC/Cedula es requerido")]
    [RegularExpression(@"^(\d{9}|\d{11})$", ErrorMessage = "El RNC debe tener 9 dígitos (Empresas) u 11 dígitos (Cédula)")]
    public string TaxId { get; set; } = null!;

    [Required(ErrorMessage = "La dirección es requerida")]
    [StringLength(100, MinimumLength = 10, ErrorMessage = "La dirección debe tener más de 10 caracteres")]
    [RegularExpression(@"^[a-zA-Z0-9\s\s#.,-]+$", ErrorMessage = "La dirección contiene caracteres no permitidos")]
    public string Address { get; set; } = null!;

    [Required(ErrorMessage = "El número de teléfono es requerido")]
    [Phone(ErrorMessage = "El formato del número de teléfono es inválido")]
    [RegularExpression(@"^\d{11}$", ErrorMessage = "El número de teléfono debe tener 11 dígitos")]
    public string PhoneNumber { get; set; } = null!;

    public string Email { get; set; } = null!; // Nuevo

    public string ContactName { get; set; } // Nuevo

    public virtual ICollection<ExpenseInvoice> ExpenseInvoices { get; set; } = new List<ExpenseInvoice>();
}
