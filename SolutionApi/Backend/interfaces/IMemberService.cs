using Backend.DTOs;
using System.Threading.Tasks;


namespace Backend.interfaces;

public interface IMemberService
{
    Task<IEnumerable<MemberResponseDTO>> ListAll();
    Task Persist(MemberCreateDTO request);
    Task Update(int memberId, MemberUpdateDTO request);
    Task Delete(int memberId);
    Task Active(int memberId);
    Task Deactive(int memberId);
}



