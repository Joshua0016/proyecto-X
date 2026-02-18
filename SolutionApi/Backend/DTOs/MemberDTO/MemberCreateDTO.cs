
namespace Backend.DTOs
{
    public record MemberCreateDTO
    (
        string Name,
        string? LastName,
        string? Telephon,
        string Email,
        string UrlPhoto,
        DateOnly Birth

    );

}