using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class log_auditorium
{
    public int id_log { get; set; }

    public DateTime? timestamp { get; set; }

    public int id_usuario { get; set; }

    public string operacion { get; set; } = null!;

    public string tabla_afectada { get; set; } = null!;

    public string detalle { get; set; } = null!;

    public string ip_origen { get; set; } = null!;

    public virtual usuario id_usuarioNavigation { get; set; } = null!;
}
