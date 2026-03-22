using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public partial class Attendance
{
    [Key]
    public int AttendanceId { get; set; }

    [Required(ErrorMessage = "El evento es obligatorio.")]
    public int EventId { get; set; }

    [Required(ErrorMessage = "El miembro es obligatorio.")]
    public int MemberId { get; set; }

    [Required(ErrorMessage = "La fecha de asistencia es obligatoria.")]
    public DateOnly Date { get; set; }

    [Required]
    public bool IsPresent { get; set; } = false;

    [DataType(DataType.Time)]
    [Display(Name = "Hora de Entrada")]
    public DateTime? EntryTime { get; set; }

    [DataType(DataType.Time)]
    [Display(Name = "Hora de Salida")]
    public DateTime? ExitTime { get; set; }

    [ForeignKey("EventId")]
    public virtual Event Event { get; set; } = null!;

    [ForeignKey("MemberId")]
    public virtual Member Member { get; set; } = null!;
}