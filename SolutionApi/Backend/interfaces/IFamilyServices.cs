using Backend.DTOs;
using System.Threading.Tasks;



namespace Backend.interfaces;

public interface IFamilyService
{
    Task<IEnumerable<FamilyDetailDTO>> ListAll();
    Task<FamilyDetailDTO?> GetById(int familyId);
    Task<IEnumerable<FamilyDetailDTO>> Search(string? query);
    Task Persist(FamilyCreateDto request);
    Task Update(int familyId, FamilyCreateDto request);
    Task Delete(int familyId);
}





