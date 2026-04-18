using Backend.DTOs;

namespace Backend.interfaces;

public interface ILedgerAccountService
{
    Task<IEnumerable<LedgerAccountResponseDTO>> ListAll();
    Task Persist(LedgerAccountCreateDto request);
    Task Delete(string accountCode);
}
