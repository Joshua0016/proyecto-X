using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record JournalCreateDto(
    [Required] DateTime Date,
    [Required][StringLength(500, MinimumLength = 3)] string Memo,
    [Required][StringLength(50, MinimumLength = 1)] string Reference,
    [Required][MinLength(1)] List<LedgerTransactionCreateDto> LedgerTransactions,
    [Required] int RecordedByUserId
);

public record JournalEntryResponseDto(
    int JournalEntryId,
    DateTime Date,
    string Memo,
    string Reference,
    bool? IsBalanced,
    int RecordedByUserId
);
