using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Proveedor
{
    public int IdProveedor { get; set; }

    public string Nombre { get; set; } = null!;

    public string Ruc { get; set; } = null!;

    public string Direccion { get; set; } = null!;

    public string Telefono { get; set; } = null!;

    public virtual ICollection<FacturaGasto> FacturaGastos { get; set; } = new List<FacturaGasto>();
}
