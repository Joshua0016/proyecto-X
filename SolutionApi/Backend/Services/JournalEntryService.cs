using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class JournalEntryService(JournalEntryRepository repo) : IJournalEntryService
{
    public async Task<IEnumerable<JournalEntryResponseDto>> ListAll() =>
        (await repo.GetAllAsync()).Adapt<IEnumerable<JournalEntryResponseDto>>();

    public async Task Persist(JournalCreateDto request)
    {
        var entry = request.Adapt<JournalEntry>();
        entry.IsBalanced = false;
        await repo.AddAsync(entry);
    }

    public async Task Delete(int id)
    {
        await repo.DeleteAsync(id);
    }
}
