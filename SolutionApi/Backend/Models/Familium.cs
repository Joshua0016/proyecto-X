using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Familium
{
    public int IdFamilia { get; set; }

    public string NombreFamilia { get; set; } = null!;

    public string Direccion { get; set; } = null!;

    public string? Telefono { get; set; }

    public virtual ICollection<Miembro> Miembros { get; set; } = new List<Miembro>();
}
