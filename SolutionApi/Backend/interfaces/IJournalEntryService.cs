using Backend.DTOs;

namespace Backend.interfaces;

public interface IJournalEntryService
{
    Task<IEnumerable<JournalEntryResponseDto>> ListAll();
    Task Persist(JournalCreateDto request);
    Task Delete(int id);
}
