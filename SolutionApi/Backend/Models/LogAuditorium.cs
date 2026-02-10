using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class LogAuditorium
{
    public int IdLog { get; set; }

    public DateTimeOffset? Timestamp { get; set; }

    public int IdUsuario { get; set; }

    public string Operacion { get; set; } = null!;

    public string TablaAfectada { get; set; } = null!;

    public string Detalle { get; set; } = null!;

    public string IpOrigen { get; set; } = null!;

    public virtual usuario IdUsuarioNavigation { get; set; } = null!;


}
