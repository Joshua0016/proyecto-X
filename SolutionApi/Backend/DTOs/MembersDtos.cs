
namespace Backend.DTOs;

public record MemberCreateDTO
   (
       string Name,
       string? LastName,
       string? PhoneNumber,
       string Email,
       string PhotoUrl,
       DateTime Birth

   );

public record MemberResponseDTO(
    int Id,
    string Name,
    string LastName,
    string? PhoneNumber,
    string? Email,
    string? PhotoUrl,
    DateTime Birth

);

public record MemberUpdateDTO
(
    string Name,
    string? LastName,
    string? PhoneNumber,
    string Email,
    string PhotoUrl,
    DateTime Birth
);




