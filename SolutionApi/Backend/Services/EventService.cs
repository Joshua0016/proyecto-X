using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class EventService(EventRepository repo) : IEventService
{
    public async Task<IEnumerable<EventResponseDTO>> ListAll() =>
        (await repo.GetAllAsync()).Adapt<IEnumerable<EventResponseDTO>>();

    public async Task<EventResponseDTO> GetById(int id)
    {
        var ev = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Evento no encontrado");
        return ev.Adapt<EventResponseDTO>();
    }

    public async Task<int> Persist(EventCreateDto request)
    {
        if (request.StartDate <= DateTime.UtcNow)
            throw new ArgumentException("La fecha de inicio no puede ser en el pasado");

        if (request.EndDate <= request.StartDate)
            throw new ArgumentException("La fecha de fin debe ser posterior a la fecha de inicio");

        var ev = request.Adapt<Event>();
        await repo.AddAsync(ev);
        return ev.EventId;
    }

    public async Task Update(int id, EventUpdateDto request)
    {
        var ev = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Evento no encontrado");

        if (request.EndDate <= request.StartDate)
            throw new ArgumentException("La fecha de fin debe ser posterior a la fecha de inicio");

        request.Adapt(ev);
        await repo.UpdateAsync(ev);
    }

    public async Task Delete(int id)
    {
        var ev = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Evento no encontrado");

        // Eliminar asistencias asociadas antes de borrar el evento
        if (ev.Attendances.Any())
            await repo.DeleteAttendancesAsync(ev.EventId);

        await repo.DeleteAsync(ev.EventId);
    }

    public async Task<IEnumerable<EventResponseDTO>> Search(string query) =>
        (await repo.SearchAsync(query)).Adapt<IEnumerable<EventResponseDTO>>();
}
