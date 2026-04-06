using Backend.DTOs;
using System.Threading.Tasks;



namespace Backend.interfaces;

public interface IFamilyService
{
    Task<IEnumerable<FamilyDetailDTO>> ListAll();
    Task<FamilyDetailDTO?> GetById(int familyId);
    Task<IEnumerable<FamilyDetailDTO>> Search(string? query);
    Task Persist(FamilyCreateDto request);
<<<<<<< HEAD
    Task Update(int id, FamilyCreateDto request);
    Task Delete(int id);




=======
    Task Update(int familyId, FamilyCreateDto request);
    Task Delete(int familyId);
>>>>>>> 469192e61c126c00c06d5e9569a4c1ece4b847dc
}





