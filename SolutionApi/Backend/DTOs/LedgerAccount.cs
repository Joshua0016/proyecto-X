namespace Backend.DTOs;

public record LedgerAccountCreateDto(
    string AccountCode,
    string Name,
    string Type,
    string SubType
);


public record LedgerAccountResponseDTO(
    string AccountCode,
    string Name,
    decimal CurrentBalance

);
