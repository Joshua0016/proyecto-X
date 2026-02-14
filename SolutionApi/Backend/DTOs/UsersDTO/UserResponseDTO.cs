namespace Backend.DTOs
{
    public record UserResponseDTO
    (
        int IdUsuario,
        string Email,
        string RolNombre,
        DateTimeOffset FechaCreacion
    );
}
