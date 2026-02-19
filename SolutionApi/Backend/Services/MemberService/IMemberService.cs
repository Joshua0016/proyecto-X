using Backend.DTOs;
using System.Threading.Tasks;


namespace Backend.Services;

public interface IMemberService
{
    Task<IEnumerable<MemberResponseDTO>> ListAll();
    Task Persist(MemberCreateDTO request);
    Task Update(int id, MemberUpdateDTO request);
    Task Delete(int id);
}



