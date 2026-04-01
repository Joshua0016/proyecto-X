using Backend.DTOs;

namespace Backend.interfaces;

public interface IExpenseInvoiceService
{
    Task<IEnumerable<ExpenseInvoiceResponseDTO>> ListAll();
    Task<IEnumerable<ExpenseInvoiceResponseDTO>> ListByVendor(int vendorId);
    Task<ExpenseInvoiceResponseDTO> GetById(int id);
    Task<int> Persist(ExpenseInvoiceCreateDto request);
    Task Update(int id, ExpenseInvoiceUpdateDto request);
    Task Delete(int id);
}
