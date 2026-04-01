using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class JournalEntryService(
    JournalEntryRepository repo,
    IGenericRepository<User> userRepo,
    IGenericRepository<LedgerAccount> accountRepo)
    : IJournalEntryService
{
    public async Task<IEnumerable<JournalEntryResponseDto>> ListAll() =>
        (await repo.GetAllAsync()).Adapt<IEnumerable<JournalEntryResponseDto>>();

    public async Task Persist(JournalCreateDto request)
    {
        var user = await userRepo.GetByIdAsync(request.RecordedByUserId);
        if (user == null)
        {
            throw new ArgumentException($"No se encontró un usuario con ID {request.RecordedByUserId}.");
        }

        foreach (var tx in request.LedgerTransactions)
        {
            if (!await accountRepo.ExistsAsync(tx.AccountCode))
            {
                throw new ArgumentException($"La cuenta contable con código '{tx.AccountCode}' no existe.");
            }
        }




        var entry = request.Adapt<JournalEntry>();
        entry.IsBalanced = false;
        entry.Date = DateTime.UtcNow;
        await repo.AddAsync(entry);
    }

    public async Task Delete(int id)
    {
        await repo.DeleteAsync(id);
    }
}
