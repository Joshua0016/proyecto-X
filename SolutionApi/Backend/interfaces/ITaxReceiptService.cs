using Backend.DTOs;

namespace Backend.interfaces;

public interface ITaxReceiptService
{
    Task<IEnumerable<TaxReceiptResponseDTO>> ListAll();
    Task<TaxReceiptResponseDTO> GetById(int id);
    Task<int> Persist(TaxReceiptCreateDto request);
    Task Delete(int id);
}
