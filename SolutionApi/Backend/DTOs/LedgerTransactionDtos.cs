using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record LedgerTransactionCreateDto(
    [Required][StringLength(20, MinimumLength = 1)] string AccountCode,
    [Range(0, double.MaxValue, ErrorMessage = "El débito no puede ser negativo")] decimal Debit,
    [Range(0, double.MaxValue, ErrorMessage = "El crédito no puede ser negativo")] decimal Credit
);

public record LedgerTransactionResponseDto(
    int TransactionId,
    int JournalEntryId,
    string AccountCode,
    decimal Debit,
    decimal Credit
);
