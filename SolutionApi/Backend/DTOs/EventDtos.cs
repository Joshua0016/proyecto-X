using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record EventCreateDto(
    [Required][StringLength(100, MinimumLength = 5)] string Title,
    [Required][StringLength(50)] string Type,
    [StringLength(1000)] string? Description,
    [Required] DateTime StartDate,
    [Required] DateTime EndDate,
    int? OrganizerUserId
);

public record EventResponseDTO(
    int EventId,
    string Title,
    string Type,
    string? Description,
    DateTime StartDate,
    DateTime EndDate,
    int? OrganizerUserId,
    string? OrganizerName
);

public record EventUpdateDto(
    [Required][StringLength(100, MinimumLength = 5)] string Title,
    [Required][StringLength(50)] string Type,
    [StringLength(1000)] string? Description,
    [Required] DateTime StartDate,
    [Required] DateTime EndDate,
    int? OrganizerUserId
);
