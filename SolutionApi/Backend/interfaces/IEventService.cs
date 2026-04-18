using Backend.DTOs;

namespace Backend.interfaces;

public interface IEventService
{
    Task<IEnumerable<EventResponseDTO>> ListAll();
    Task<EventResponseDTO> GetById(int id);
    Task<int> Persist(EventCreateDto request);
    Task Update(int id, EventUpdateDto request);
    Task Delete(int id);
    Task<IEnumerable<EventResponseDTO>> Search(string query);
}
