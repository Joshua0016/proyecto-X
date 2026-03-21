using Backend.DTOs;

namespace Backend.interfaces;

public interface ILedgerTransactionService
{
    Task<IEnumerable<LedgerTransactionResponseDto>> ListAll();
    Task Persist(LedgerTransactionCreateDto request, int journalEntryId);
    Task Delete(int id);
}
