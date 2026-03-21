using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class LedgerAccountService(LedgerAccountRepository repo) : ILedgerAccountService
{
    public async Task<IEnumerable<LedgerAccountResponseDTO>> ListAll() =>
        (await repo.GetAllAsync()).Adapt<IEnumerable<LedgerAccountResponseDTO>>();

    public async Task Persist(LedgerAccountCreateDto request)
    {
        if (await repo.ExistsAsync(request.AccountCode))
            throw new Exception("La cuenta ya existe");

        await repo.AddAsync(request.Adapt<LedgerAccount>());
    }

    public async Task Delete(string accountCode)
    {
        await repo.DeleteByCodeAsync(accountCode);
    }
}
