namespace Backend.DTOs
{
    public record MemberResponseDTO(
        int MemberId,
        string Name,
        string LastName,
        string? PhoneNumber,
        string? Email,
        string? PhotoUrl,
        DateOnly Birth

    );

}