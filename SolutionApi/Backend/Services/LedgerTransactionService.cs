using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class LedgerTransactionService(
    LedgerTransactionRepository repo,
    IGenericRepository<LedgerAccount> accountRepo) : ILedgerTransactionService
{
    public async Task<IEnumerable<LedgerTransactionResponseDto>> ListAll() =>
        (await repo.GetAllAsync()).Adapt<IEnumerable<LedgerTransactionResponseDto>>();

    public async Task Persist(LedgerTransactionCreateDto request, int journalEntryId)
    {
        if (!await accountRepo.ExistsAsync(request.AccountCode))
        {
            throw new ArgumentException($"La cuenta contable con código '{request.AccountCode}' no existe.");
        }

        var transaction = request.Adapt<LedgerTransaction>();
        transaction.JournalEntryId = journalEntryId;
        await repo.AddAsync(transaction);
    }

    public async Task Delete(int id)
    {
        await repo.DeleteAsync(id);
    }
}
