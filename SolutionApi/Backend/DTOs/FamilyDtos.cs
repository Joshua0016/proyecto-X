using System.ComponentModel.DataAnnotations;
using Backend.Models;


namespace Backend.DTOs;

public record FamilyCreateDto(
    [Required] string LastName,
    string? District,
    string? Sector,
    string? Address,
    DateTime CreatedAt,
    List<int>? MemberIds

);

public record FamilyResponseDTO(
    int Id,
    string LastName,
    int MemberCount
);

public record FamilyDetailDTO(
    int Id,
    string LastName,
    IEnumerable<MemberResponseDTO> Members
);
