using Backend.DTOs;
using System.Threading.Tasks;



namespace Backend.interfaces;

public interface IFamilyService
{
    Task<IEnumerable<FamilyDetailDTO>> ListAll();
    Task<FamilyDetailDTO?> GetById(int id);
    Task<IEnumerable<FamilyDetailDTO>> Search(string? query);
    Task Persist(FamilyCreateDto request);
    Task Update(int id, FamilyCreateDto request);
    Task Delete(int id);

    Task AddMemberToFamily(int familyId, int memberId);

    Task RemoveMemberFromFamily(int familyId, int memberId);


}





