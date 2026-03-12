namespace Backend.DTOs
{
    public record MemberResponseDTO(
        int IdMember,
        string Name,
        string LastName,
        string? PhoneNumber,
        string? Email,
        string? PhotoUrl,
        DateOnly Birth

    );

}