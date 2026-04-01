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
            throw new InvalidOperationException($"Ya existe una cuenta con el código '{request.AccountCode}'");

        var account = request.Adapt<LedgerAccount>();
        account.IsActive = true;
        account.CurrentBalance = 0;
        await repo.AddAsync(account);
    }

    public async Task Delete(string accountCode)
    {
        if (!await repo.ExistsAsync(accountCode))
            throw new KeyNotFoundException($"No existe una cuenta con el código '{accountCode}'");

        await repo.DeleteByCodeAsync(accountCode);
    }
}
