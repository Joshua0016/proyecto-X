using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class AttendanceService(AttendanceRepository repo) : IAttendanceService
{
    public async Task<IEnumerable<AttendanceResponseDTO>> ListAll() =>
        (await repo.GetAllAsync()).Adapt<IEnumerable<AttendanceResponseDTO>>();

    public async Task<IEnumerable<AttendanceResponseDTO>> ListByEvent(int eventId) =>
        (await repo.GetByEventAsync(eventId)).Adapt<IEnumerable<AttendanceResponseDTO>>();

    public async Task<IEnumerable<AttendanceResponseDTO>> ListByMember(int memberId) =>
        (await repo.GetByMemberAsync(memberId)).Adapt<IEnumerable<AttendanceResponseDTO>>();

    public async Task<AttendanceResponseDTO> GetById(int id)
    {
        var attendance = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Asistencia no encontrada");
        return attendance.Adapt<AttendanceResponseDTO>();
    }

    public async Task<int> Persist(AttendanceCreateDto request)
    {
        if (await repo.ExistsDuplicateAsync(request.EventId, request.MemberId))
            throw new InvalidOperationException("El miembro ya tiene una asistencia registrada para este evento");

        var attendance = request.Adapt<Attendance>();
        await repo.AddAsync(attendance);
        return attendance.AttendanceId;
    }

    public async Task Update(int id, AttendanceUpdateDto request)
    {
        var attendance = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Asistencia no encontrada");

        request.Adapt(attendance);
        await repo.UpdateAsync(attendance);
    }

    public async Task Delete(int id)
    {
        var attendance = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Asistencia no encontrada");
        await repo.DeleteAsync(attendance.AttendanceId);
    }
}
