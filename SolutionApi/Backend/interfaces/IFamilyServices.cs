using Backend.DTOs;
using System.Threading.Tasks;



namespace Backend.interfaces;

public interface IFamilyService
{
    Task<IEnumerable<FamilyResponseDTO>> ListAll();
    Task Persist(FamilyCreateDto request);
    Task Update(int id, FamilyCreateDto request);
    Task Delete(int id);
}





