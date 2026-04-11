using System.ComponentModel.DataAnnotations;
using Backend.commons;
using Backend.Models;

namespace Backend.DTOs;

public record EventCreateDto(
    [Required][StringLength(100, MinimumLength = 5)] string Title,
    [Required][StringLength(50)] string Type,
    [StringLength(1000)] string? Description,
    string? Location,
    int capacity,
    bool IsOrdinary,
    EventStatus Status,
    bool IsRecurring,
    [Required] DateTime StartDate,
    [Required] DateTime EndDate,
    int? OrganizerUserId
);

public record EventResponseDTO(
    int EventId,
    string Title,
    string Type,
    string? Description,
    string? Location,
    int Capacity,
    bool IsOrdinary,
    EventStatus Status,
    bool IsRecurring,
    DateTime StartDate,
    DateTime EndDate,
    int? OrganizerUserId,
    string? OrganizerName
);

public record EventUpdateDto(
    [Required][StringLength(100, MinimumLength = 5)] string Title,
    [Required][StringLength(50)] string Type,
    [StringLength(1000)] string? Description,
    string? Location,
    int capacity,
    bool IsOrdinary,
    EventStatus Status,
    bool IsRecurring,
    [Required] DateTime StartDate,
    [Required] DateTime EndDate,
    int? OrganizerUserId
);
