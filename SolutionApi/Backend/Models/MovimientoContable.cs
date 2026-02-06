using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class MovimientoContable
{
    public int IdMovimiento { get; set; }

    public int IdAsiento { get; set; }

    public string CodigoCuenta { get; set; } = null!;

    public decimal Debe { get; set; }

    public decimal Haber { get; set; }

    public virtual CuentaContable CodigoCuentaNavigation { get; set; } = null!;

    public virtual AsientoContable IdAsientoNavigation { get; set; } = null!;
}
