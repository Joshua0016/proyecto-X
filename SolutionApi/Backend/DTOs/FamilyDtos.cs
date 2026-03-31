using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record FamilyCreateDto(
    [Required] string LastName,
    string? District,
    string? Sector,
    string? Address,
    DateTime CreatedAt
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
