using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record AttendanceCreateDto(
    [Required] int EventId,
    [Required] int MemberId,
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
    bool IsPresent,
    DateTime? EntryTime,
    DateTime? ExitTime
);

public record AttendanceUpdateDto(
    [Required] bool IsPresent,
    DateTime? EntryTime,
    DateTime? ExitTime
);
