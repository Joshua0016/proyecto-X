namespace Backend.DTOs;

public record JournalCreateDto(
    DateTime Date,
    string Memo,
    string Reference,
    List<LedgerTransactionCreateDto> LedgerTransactions,
    int RecordedByUSerId
);



public record JournalEntryResponseDto(
    int JournalEntryId,
    DateTime Date,
    string Memo,
    string Reference,
    bool? IsBalanced,
    int RecordedByUserId
);

