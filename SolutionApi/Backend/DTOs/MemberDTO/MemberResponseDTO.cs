namespace Backend.DTOs
{
    public record MemberResponseDTO(
        int IdMiembro,
        string Nombre,
        string Apellido,
        string? Telefono,
        string? Correo,
        string? UrlFoto,
        DateOnly FechaNacimiento

    );

}