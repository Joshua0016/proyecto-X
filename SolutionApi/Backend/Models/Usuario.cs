using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        public int IdRol { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        [ForeignKey("IdRol")]
        public virtual Rol? Rol { get; set; } = null;
    }
}
