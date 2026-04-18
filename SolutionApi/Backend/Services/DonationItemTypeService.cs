using Backend.Models;
using Backend.interfaces;
using Backend.DTOs;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class DonationItemTypeService(DonationItemTypeRepository repo) : IDonationItemTypeService
{
    public async Task<IEnumerable<DonationItemTypeResponseDTO>> GetAllsAsync()
    {
        var items = await repo.GetAllAsync();
        return items.Adapt<IEnumerable<DonationItemTypeResponseDTO>>();
    }

    public async Task<DonationItemType?> GetByIdAsync(int id)
    {
        return await repo.GetByIdAsync(id);
    }

    public async Task AddAsync(DonationItemTypeCreateDTO dto)
    {
        if (await repo.ExistsAsync(dto.Name))
            throw new InvalidOperationException("Ya existe un tipo de donación con ese nombre");

        var entity = dto.Adapt<DonationItemType>();
        entity.CreatedAt = DateTime.UtcNow;
        await repo.AddAsync(entity);
    }

    public async Task UpdateAsync(DonationItemTypeResponseDTO dto, int id)
    {
        var entity = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Tipo de donación no encontrado");

        entity.Name = dto.Name;
        entity.Category = dto.Category;
        await repo.UpdateAsync(entity);
    }

    public async Task DeleteAsync(int id)
    {
        await repo.DeleteAsync(id);
    }
}
