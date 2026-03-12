
namespace Backend.DTOs
{
    public record MemberCreateDTO
    (
        string Name,
        string? LastName,
        string? PhoneNumber,
        string Email,
        string UrlPhoto,
        DateOnly Birth

    );

}