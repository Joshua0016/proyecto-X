using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public partial class AuditLog
{
    [Key]
    public int LogId { get; set; }

    [Required]
    [DataType(DataType.DateTime)]
    public DateTime? Timestamp { get; set; } = DateTime.UtcNow;

    [Required(ErrorMessage = "El usuario responsable de la acción es obligatorio.")]
    public int UserId { get; set; }

    [Required]
    [StringLength(50, ErrorMessage = "La operación no puede exceder los 50 caracteres.")]
    // Ej: INSERT, UPDATE, DELETE, LOGIN, EXPORT
    public string Operation { get; set; } = null!;

    [Required]
    [StringLength(100, ErrorMessage = "El nombre de la tabla afectada no puede exceder los 100 caracteres.")]
    public string AffectedTable { get; set; } = null!;

    [Required]
    [StringLength(4000, ErrorMessage = "El detalle no puede exceder los 4000 caracteres.")]
    public string Detail { get; set; } = null!;

    [Required]
    [StringLength(45, ErrorMessage = "La dirección IP no es válida.")]
    public string SourceIp { get; set; } = null!;

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
}