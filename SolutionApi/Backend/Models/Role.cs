using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public partial class Role
{
    [Key]
    public int RoleId { get; set; }

    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres.")]
    [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "El nombre solo debe contener letras.")]
    public string Name { get; set; } = null!;

    [StringLength(250, ErrorMessage = "La descripción no puede exceder los 250 caracteres.")]
    [Display(Name = "Descripción")]
    public string? Description { get; set; }

    // Relación inversa
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}