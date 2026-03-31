namespace Backend.DTOs;

public record JournalCreateDto(
    DateTime Date,
    string Memo,
    string Reference,
    List<LedgerTransactionCreateDto> LedgerTransactions,
    UserDto RecordedByUSer 
);



public record JournalEntryResponseDto(
    int JournalEntryId,
    DateTime Date,
    string Memo,
    string Reference,
    bool? IsBalanced,
    int RecordedByUserId
);

public record UserDto(
    int UserId,
    string Name 
);
