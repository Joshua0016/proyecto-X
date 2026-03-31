using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record FamilyCreateDto(
    [Required] string FamilyName,
    string? District,
    string? Sector,
    string? Address,
    DateTime CreatedAt
);

public record FamilyResponseDTO(
    int Id,
    string FamilyName,
    int MemberCount
);

public record FamilyDetailDTO(
    int Id,
    string FamilyName,
    IEnumerable<MemberResponseDTO> Members
);
