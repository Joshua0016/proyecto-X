using System.ComponentModel.DataAnnotations;
using Backend.Models;


namespace Backend.DTOs;

public record FamilyCreateDto(
    [Required] string LastName,
    List<int>? MemberIds
);

public record FamilyResponseDTO(
    int FamilyId,
    string LastName,
    DateTime CreatedAt,
    IEnumerable<MemberResponseDTO> Members
);

public record FamilyDetailDTO(
    int FamilyId,
    string LastName,
    DateTime CreatedAt,
    IEnumerable<MemberResponseDTO> Members
);
