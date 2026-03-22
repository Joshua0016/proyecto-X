using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public partial class Event
{
    [Key]
    public int EventId { get; set; }

    [Required(ErrorMessage = "El título del evento es obligatorio.")]
    [StringLength(150, MinimumLength = 5, ErrorMessage = "El título debe tener entre 5 y 150 caracteres.")]
    public string Title { get; set; } = null!;

    [Required(ErrorMessage = "El tipo de evento es obligatorio.")]
    [StringLength(50, ErrorMessage = "El tipo de evento no puede exceder los 50 caracteres.")]
    // Ej: Conferencia, Reunión, Taller
    public string Type { get; set; } = null!;

    [StringLength(1000, ErrorMessage = "La descripción no puede exceder los 1000 caracteres.")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "La fecha de inicio es obligatoria.")]
    [DataType(DataType.DateTime)]
    [Display(Name = "Fecha de Inicio")]
    public DateTime StartDate { get; set; }

    [Required(ErrorMessage = "La fecha de finalización es obligatoria.")]
    [DataType(DataType.DateTime)]
    [Display(Name = "Fecha de Fin")]
    public DateTime EndDate { get; set; }

    public int? OrganizerUserId { get; set; }

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    [ForeignKey("OrganizerUserId")]
    public virtual User? OrganizerUser { get; set; }
}