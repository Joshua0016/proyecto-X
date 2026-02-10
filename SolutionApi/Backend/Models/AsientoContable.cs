using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class AsientoContable
{
    public int IdAsiento { get; set; }

    public DateTime Fecha { get; set; }

    public string Glosa { get; set; } = null!;

    public string Referencia { get; set; } = null!;

    public bool? Cuadrado { get; set; }

    public int IdUsuarioRegistrador { get; set; }

    public virtual ICollection<FacturaGasto> FacturaGastos { get; set; } = new List<FacturaGasto>();

    public virtual usuario IdUsuarioRegistradorNavigation { get; set; } = null!;

    public virtual ICollection<MovimientoContable> MovimientoContables { get; set; } = new List<MovimientoContable>();
}
