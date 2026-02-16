using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public partial class Miembro
{
    public int IdMiembro { get; set; }
    [Column("nombre")]
    public string Nombre { get; set; } = null!;
    [Column("apellido")]
    public string Apellido { get; set; } = null!;

    [Column("telefono")]
    public string Telefono { get; set; } = null!;
    [Column("email")]
    public string? Email { get; set; }

    [Column("foto_url")]
    public string? FotoUrl { get; set; }
    [Column("fecha_nacimiento")]
    public DateOnly FechaNacimiento { get; set; }

  
}
