using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record MemberCreateDTO(
    [Required][StringLength(50, MinimumLength = 2)] string FirstName,
    [StringLength(50, MinimumLength = 2)] string? LastName,
    [Phone][StringLength(15)] string? PhoneNumber,
    [EmailAddress][StringLength(150)] string? Email,
    [Url] string? PhotoUrl,
    [Required] DateTime BirthDate,
    int? FamilyId
);

public record MemberResponseDTO(
    int memberId,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    string? Email,
    string? PhotoUrl,
    DateTime BirthDate
);

public record MemberUpdateDTO(
    [Required][StringLength(50, MinimumLength = 2)] string FirstName,
    [StringLength(50, MinimumLength = 2)] string? LastName,
    [Phone][StringLength(15)] string? PhoneNumber,
    [EmailAddress][StringLength(150)] string? Email,
    [Url] string? PhotoUrl,
    [Required] DateTime BirthDate,
    int? FamilyId
);
