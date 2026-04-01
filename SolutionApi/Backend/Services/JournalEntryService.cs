using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class JournalEntryService(
    JournalEntryRepository repo,
    IGenericRepository<User> userRepo,
    IGenericRepository<LedgerAccount> accountRepo) : IJournalEntryService
{
    public async Task<IEnumerable<JournalEntryResponseDto>> ListAll() =>
        (await repo.GetAllAsync()).Adapt<IEnumerable<JournalEntryResponseDto>>();

    public async Task Persist(JournalCreateDto request)
    {
        if (!request.LedgerTransactions.Any())
            throw new ArgumentException("El asiento debe tener al menos una transacción");

        if (request.Date > DateTime.UtcNow)
            throw new ArgumentException("La fecha del asiento no puede ser futura");

        if (await userRepo.GetByIdAsync(request.RecordedByUserId) is null)
            throw new ArgumentException($"No existe un usuario con ID {request.RecordedByUserId}");

        foreach (var tx in request.LedgerTransactions)
        {
            if (tx.Debit == 0 && tx.Credit == 0)
                throw new ArgumentException($"La transacción para la cuenta '{tx.AccountCode}' no puede tener débito y crédito en cero");

            if (tx.Debit > 0 && tx.Credit > 0)
                throw new ArgumentException($"La transacción para '{tx.AccountCode}' no puede tener débito y crédito simultáneamente");

            if (!await accountRepo.ExistsAsync(tx.AccountCode))
                throw new ArgumentException($"La cuenta contable '{tx.AccountCode}' no existe");
        }

        var totalDebits  = request.LedgerTransactions.Sum(t => t.Debit);
        var totalCredits = request.LedgerTransactions.Sum(t => t.Credit);
        var isBalanced   = totalDebits == totalCredits;

        var entry = request.Adapt<JournalEntry>();
        entry.IsBalanced = isBalanced;
        entry.Date = DateTime.UtcNow;
        await repo.AddAsync(entry);
    }

    public async Task Delete(int id)
    {
        var entry = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Asiento contable no encontrado");

        if (entry.IsBalanced == true)
            throw new InvalidOperationException("No se puede eliminar un asiento balanceado");

        await repo.DeleteAsync(id);
    }
}
