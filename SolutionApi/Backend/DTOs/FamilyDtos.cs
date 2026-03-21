namespace Backend.DTOs;

public record FamilyCreateDto
(
    string FamilyName,
    string? Address,
    string? PhoneNumber
);

public record FamilyResponseDTO
(
    int Id,
    string FamilyName,
    string Address,
    string PhoneNumber
);

