using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Asistencium
{
    public int IdAsistencia { get; set; }

    public int IdEvento { get; set; }

    public int IdMiembro { get; set; }

    public DateOnly Fecha { get; set; }

    public bool Presente { get; set; }

    public DateTime? HoraEntrada { get; set; }

    public DateTime? HoraSalida { get; set; }

    public virtual Evento IdEventoNavigation { get; set; } = null!;

    public virtual Miembro IdMiembroNavigation { get; set; } = null!;
}
