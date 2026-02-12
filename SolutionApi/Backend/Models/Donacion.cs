using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Donacion
{
    public int IdDonacion { get; set; }

    public int IdMiembro { get; set; }

    public decimal Monto { get; set; }

    public DateTime Fecha { get; set; }

    public string Tipo { get; set; } = null!;

    public string MetodoPago { get; set; } = null!;

    public string Estado { get; set; } = null!;

    public virtual Miembro IdMiembroNavigation { get; set; } = null!;

    public virtual ICollection<ReciboFiscal> ReciboFiscals { get; set; } = new List<ReciboFiscal>();
}
