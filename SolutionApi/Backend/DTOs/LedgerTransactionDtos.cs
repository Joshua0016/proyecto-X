namespace Backend.DTOs;

public record LedgerTransactionCreateDto(
    string AccountCode,
    decimal Debit,
    decimal Credit
);

public record LedgerTransactionResponseDto(
    int TransactionId,
    int JournalEntryId,
    string AccountCode,
    decimal Debit,
    decimal Credit
);
