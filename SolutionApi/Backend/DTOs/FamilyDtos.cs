using System.ComponentModel.DataAnnotations;
using Backend.Models;


namespace Backend.DTOs;

public record FamilyCreateDto(
    [Required] string LastName,
    string? District,
    string? Sector,
    string? Address,
    DateTime CreatedAt,
    int? FamilyId,
    List<int>? MemberIds
);

public record FamilyResponseDTO(
    int FamilyId,
    string LastName,
    string? District,
    string? Sector,
    string? Address,
    DateTime CreatedAt,
    IEnumerable<MemberResponseDTO> Members
);

public record FamilyDetailDTO(
    int FamilyId,
    string LastName,
    string? District,
    string? Sector,
    string? Address,
    DateTime CreatedAt,
    IEnumerable<MemberResponseDTO> Members
);
