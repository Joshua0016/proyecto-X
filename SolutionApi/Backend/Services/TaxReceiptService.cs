using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class TaxReceiptService(TaxReceiptRepository repo) : ITaxReceiptService
{
    public async Task<IEnumerable<TaxReceiptResponseDTO>> ListAll() =>
        (await repo.GetAllAsync()).Adapt<IEnumerable<TaxReceiptResponseDTO>>();

    public async Task<TaxReceiptResponseDTO> GetById(int id)
    {
        var receipt = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Comprobante fiscal no encontrado");
        return receipt.Adapt<TaxReceiptResponseDTO>();
    }

    public async Task<int> Persist(TaxReceiptCreateDto request)
    {
        if (await repo.ExistsByCodeAsync(request.Code))
            throw new InvalidOperationException("Ya existe un comprobante con ese código");

        if (!await repo.DonationExistsAsync(request.DonationId))
            throw new ArgumentException("La donación especificada no existe");

        var receipt = request.Adapt<TaxReceipt>();
        receipt.IssueDate = request.IssueDate.ToDateTime(TimeOnly.MinValue);
        await repo.AddAsync(receipt);
        return receipt.TaxReceiptId;
    }

    public async Task Delete(int id)
    {
        var receipt = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Comprobante fiscal no encontrado");
        await repo.DeleteAsync(receipt.TaxReceiptId);
    }
}
