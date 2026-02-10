using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Miembro
{
    public int IdMiembro { get; set; }

    public string Nombre { get; set; } = null!;

    public string Apellido { get; set; } = null!;

    public string? FotoUrl { get; set; }

    public DateOnly FechaNacimiento { get; set; }

    public int IdUsuario { get; set; }

    public int IdFamilia { get; set; }

    public virtual ICollection<Asistencium> Asistencia { get; set; } = new List<Asistencium>();

    public virtual ICollection<Donacion> Donacions { get; set; } = new List<Donacion>();

    public virtual Familium IdFamiliaNavigation { get; set; } = null!;

    public virtual usuario IdUsuarioNavigation { get; set; } = null!;
}
