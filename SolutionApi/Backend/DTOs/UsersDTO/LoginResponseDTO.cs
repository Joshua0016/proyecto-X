using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public record LoginResponseDTO(
        string Token,
        string Email,
        string Rol
    );

}
