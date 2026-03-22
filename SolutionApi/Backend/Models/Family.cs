using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public partial class Family
{
    [Key]
    public int FamilyId { get; set; }

    [Required(ErrorMessage = "El nombre de la familia es obligatorio.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres.")]
    [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "El nombre solo debe contener letras.")]
    public string FamilyName { get; set; } = null!;

    [Required(ErrorMessage = "La dirección es obligatoria.")]
    [StringLength(250, MinimumLength = 10, ErrorMessage = "La dirección debe tener entre 10 y 250 caracteres.")]
    public string Address { get; set; } = null!;

    [Phone(ErrorMessage = "El formato del número de teléfono no es válido.")]
    [StringLength(20, ErrorMessage = "El teléfono no puede exceder los 20 caracteres.")]
    [Display(Name = "Teléfono de contacto")]
    public string? PhoneNumber { get; set; }
}