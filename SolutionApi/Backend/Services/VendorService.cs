using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class VendorService(VendorRepository repo) : IVendorService
{
    public async Task<IEnumerable<VendorResponseDTO>> ListAll() =>
        (await repo.GetAllAsync()).Adapt<IEnumerable<VendorResponseDTO>>();

    public async Task<VendorResponseDTO> GetById(int id)
    {
        var vendor = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Proveedor no encontrado");
        return vendor.Adapt<VendorResponseDTO>();
    }

    public async Task<int> Persist(VendorCreateDto request)
    {
        if (await repo.ExistsByTaxIdAsync(request.TaxId))
            throw new InvalidOperationException("Ya existe un proveedor con ese RNC/Cédula");

        var vendor = request.Adapt<Vendor>();
        await repo.AddAsync(vendor);
        return vendor.VendorId;
    }

    public async Task Update(int id, VendorUpdateDto request)
    {
        var vendor = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Proveedor no encontrado");

        request.Adapt(vendor);
        await repo.UpdateAsync(vendor);
    }

    public async Task Delete(int id)
    {
        var vendor = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Proveedor no encontrado");

        if (vendor.ExpenseInvoices.Any())
            throw new InvalidOperationException("No se puede eliminar un proveedor con facturas asociadas");

        await repo.DeleteAsync(vendor.VendorId);
    }
}
