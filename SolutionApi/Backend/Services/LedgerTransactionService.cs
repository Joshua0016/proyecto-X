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
        if (request.Debit == 0 && request.Credit == 0)
            throw new ArgumentException("La transacción no puede tener débito y crédito en cero");

        if (request.Debit > 0 && request.Credit > 0)
            throw new ArgumentException("Una transacción no puede tener débito y crédito simultáneamente");

        if (!await accountRepo.ExistsAsync(request.AccountCode))
            throw new ArgumentException($"La cuenta contable '{request.AccountCode}' no existe");

        var transaction = request.Adapt<LedgerTransaction>();
        transaction.JournalEntryId = journalEntryId;
        await repo.AddAsync(transaction);
    }

    public async Task Delete(int id)
    {
        var transaction = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Transacción no encontrada");
        await repo.DeleteAsync(transaction.TransactionId);
    }
}
