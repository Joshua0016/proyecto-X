using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public partial class Member
{
    [Key]
    public int MemberId { get; set; }

    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres.")]
    [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "El nombre solo debe contener letras.")]
    public string FirstName { get; set; } = null!;

    [Required(ErrorMessage = "El apellido es obligatorio.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El apellido debe tener entre 3 y 100 caracteres.")]
    [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "El apellido solo debe contener letras.")]
    public string LastName { get; set; } = null!;

    [Url(ErrorMessage = "La URL de la foto no es válida.")]
    public string? PhotoUrl { get; set; }

    [Required(ErrorMessage = "La fecha de nacimiento es obligatoria.")]
    [DataType(DataType.Date)]
    [Display(Name = "Fecha de Nacimiento")]
    public DateTime BirthDate { get; set; }

    [Phone(ErrorMessage = "El formato del número de teléfono no es válido.")]
    [StringLength(11, ErrorMessage = "El teléfono no puede exceder los 11 caracteres.")]
    public string? PhoneNumber { get; set; }

    [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido.")]
    [StringLength(150, ErrorMessage = "El correo no puede exceder los 150 caracteres.")]
    public string? Email { get; set; }

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    public virtual ICollection<Donation> Donations { get; set; } = new List<Donation>();

    public int? FamilyId { get; set; }
    public virtual Family? Family { get; set; }
}