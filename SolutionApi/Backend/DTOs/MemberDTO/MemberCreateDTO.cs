
namespace Backend.DTOs
{
    public record MemberCreateDTO
    (
        string Nombre,
        string? Apellido,
        string? Telefono,
        string Email,
        string FotoUrl,
        DateOnly FechaNacimiento 
        
    );

}