namespace Backend.DTOs
{
    public record RegisterRequestDto(
        string Email,
        string Password,
        int IdRol
    );
}
