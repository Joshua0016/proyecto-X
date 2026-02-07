using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Usuario
{
    public int IdUsuario { get; set; }

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int IdRol { get; set; }

    public DateTime FechaCreacion { get; set; }

    public virtual ICollection<AsientoContable> AsientoContables { get; set; } = new List<AsientoContable>();

    public virtual ICollection<Evento> Eventos { get; set; } = new List<Evento>();

    public virtual Rol IdRolNavigation { get; set; } = null!;

    public virtual ICollection<LogAuditorium> LogAuditoria { get; set; } = new List<LogAuditorium>();

    public virtual ICollection<Miembro> Miembros { get; set; } = new List<Miembro>();
}
