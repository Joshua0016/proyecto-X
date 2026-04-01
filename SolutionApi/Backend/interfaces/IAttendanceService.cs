using Backend.DTOs;

namespace Backend.interfaces;

public interface IAttendanceService
{
    Task<IEnumerable<AttendanceResponseDTO>> ListAll();
    Task<IEnumerable<AttendanceResponseDTO>> ListByEvent(int eventId);
    Task<IEnumerable<AttendanceResponseDTO>> ListByMember(int memberId);
    Task<AttendanceResponseDTO> GetById(int id);
    Task<int> Persist(AttendanceCreateDto request);
    Task Update(int id, AttendanceUpdateDto request);
    Task Delete(int id);
}
