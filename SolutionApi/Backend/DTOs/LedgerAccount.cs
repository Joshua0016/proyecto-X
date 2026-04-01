using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record LedgerAccountCreateDto(
    [Required][StringLength(20, MinimumLength = 1)] string AccountCode,
    [Required][StringLength(100, MinimumLength = 3)] string Name,
    [Required][StringLength(50, MinimumLength = 2)] string Type,
    [Required][StringLength(50, MinimumLength = 2)] string SubType
);

public record LedgerAccountResponseDTO(
    string AccountCode,
    string Name,
    decimal CurrentBalance
);
