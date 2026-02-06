using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Rol
    {
        [Key]
        public int IdRol { get; set; }

        [Required, StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();

    }
}
