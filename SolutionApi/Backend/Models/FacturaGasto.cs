using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class FacturaGasto
{
    public int IdFacturaGasto { get; set; }

    public int IdProveedor { get; set; }

    public string NumeroFactura { get; set; } = null!;

    public decimal Total { get; set; }

    public DateTime FechaEmision { get; set; }

    public DateTime FechaVencimiento { get; set; }

    public string Estado { get; set; } = null!;

    public int IdAsiento { get; set; }

    public virtual AsientoContable IdAsientoNavigation { get; set; } = null!;

    public virtual Proveedor IdProveedorNavigation { get; set; } = null!;
}
