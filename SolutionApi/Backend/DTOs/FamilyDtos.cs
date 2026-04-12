using System.ComponentModel.DataAnnotations;
using Backend.commons;

namespace Backend.DTOs;

public record FamilyCreateDto(
    [Required][StringLength(100, MinimumLength = 2)] string LastName
);

// Miembro con su relación dentro de la familia
public record FamilyMemberResponseDTO(
    int MemberId,
    string FirstName,
    string? SecondName,
    string? LastName,
    string? SecondLastName,
    string? PhoneNumber,
    string? Email,
    DateTime BirthDate,
    Gender Gender,
    MaritalStatus MaritalStatus,
    string? PhotoUrl,
    string? Relationship,
    string? NationalId,
    string? BloodType,
    string? Address,
    MemberType? MemberType,
    bool? IsActive,
    bool Baptized,
    DateTime? JoinDate,
    string? Profession,
    string? Occupation,
    AcademicLevel? AcademicLevel
);

public record FamilyResponseDTO(
    int FamilyId,
    string LastName,
    DateTime CreatedAt,
    IEnumerable<FamilyMemberResponseDTO> Members
);

public record FamilyDetailDTO(
    int FamilyId,
    string LastName,
    DateTime CreatedAt,
    IEnumerable<FamilyMemberResponseDTO> Members
);
