using Backend.DTOs;

namespace Backend.interfaces;

public interface IVendorService
{
    Task<IEnumerable<VendorResponseDTO>> ListAll();
    Task<VendorResponseDTO> GetById(int id);
    Task<int> Persist(VendorCreateDto request);
    Task Update(int id, VendorUpdateDto request);
    Task Delete(int id);
}
