using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class usuario
{
    public int id_usuario { get; set; }

    public string email { get; set; } = null!;

    public string password { get; set; } = null!;

    public int id_rol { get; set; }

    public DateTime fecha_creacion { get; set; }

    public virtual rol id_rolNavigation { get; set; } = null!;

    public virtual ICollection<log_auditorium> log_auditoria { get; set; } = new List<log_auditorium>();
}
