using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record AttendanceCreateDto(
    [Required] int EventId,
    [Required] int MemberId,
    [Required] DateOnly Date,
    [Required] bool IsPresent,
    DateTime? EntryTime,
    DateTime? ExitTime
);

public record AttendanceResponseDTO(
    int AttendanceId,
    int EventId,
    string EventTitle,
    int MemberId,
    string MemberName,
    DateOnly Date,
    bool IsPresent,
    DateTime? EntryTime,
    DateTime? ExitTime
);

public record AttendanceUpdateDto(
    [Required] bool IsPresent,
    DateTime? EntryTime,
    DateTime? ExitTime
);
