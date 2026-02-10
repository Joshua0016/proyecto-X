using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class rol
{
    public int id_rol { get; set; }

    public string nombre { get; set; } = null!;

    public string? descripcion { get; set; }

    public virtual ICollection<usuario> usuarios { get; set; } = new List<usuario>();
}
