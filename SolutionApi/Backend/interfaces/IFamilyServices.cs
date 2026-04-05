using Backend.DTOs;
using System.Threading.Tasks;



namespace Backend.interfaces;

public interface IFamilyService
{
    Task<IEnumerable<FamilyResponseDTO>> ListAll();
    Task<FamilyDetailDTO?> GetById(int id);
    Task<IEnumerable<FamilyResponseDTO>> Search(string? familyName, string? memberName);
    Task Persist(FamilyCreateDto request);
    Task Update(int id, FamilyCreateDto request);
    Task Delete(int id);

    Task AddMemberToFamily(int familyId, int memberId);

    Task RemoveMemberFromFamily(int familyId, int memberId);


}





