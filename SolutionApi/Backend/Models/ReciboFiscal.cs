using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class ReciboFiscal
{
    public int IdReciboFiscal { get; set; }

    public string Codigo { get; set; } = null!;

    public DateTime FechaEmision { get; set; }

    public int IdDonacion { get; set; }

    public virtual Donacion IdDonacionNavigation { get; set; } = null!;
}
