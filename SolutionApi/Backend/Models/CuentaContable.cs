using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class CuentaContable
{
    public string CodigoCuenta { get; set; } = null!;

    public string Nombre { get; set; } = null!;

    public string Tipo { get; set; } = null!;

    public string Subtipo { get; set; } = null!;

    public decimal SaldoActual { get; set; }

    public bool Activa { get; set; }

    public virtual ICollection<MovimientoContable> MovimientoContables { get; set; } = new List<MovimientoContable>();
}
