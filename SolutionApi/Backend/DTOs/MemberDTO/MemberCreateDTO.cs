namespace Backend.DTOs
{
    public record MemberCreateDTO
    (
        string Nombre,
        string? Apellido,
        string? Telefono,
        int IdUsuario,
        int IdFamilia
    );

}