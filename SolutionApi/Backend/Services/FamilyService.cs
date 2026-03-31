using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class FamilyService(FamilyRepository repo) : IFamilyService
{
    public async Task<IEnumerable<FamilyResponseDTO>> ListAll() =>
        (await repo.GetAllAsync()).Adapt<IEnumerable<FamilyResponseDTO>>();

    public async Task<FamilyDetailDTO?> GetById(int id)
    {
        var family = await repo.GetByIdAsync(id);
        return family?.Adapt<FamilyDetailDTO>();
    }

    public async Task<IEnumerable<FamilyResponseDTO>> Search(string? familyName, string? memberName) =>
        (await repo.SearchAsync(familyName, memberName)).Adapt<IEnumerable<FamilyResponseDTO>>();

    public async Task Persist(FamilyCreateDto dto)
    {
        var family = dto.Adapt<Family>();
        family.CreatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified);
        await repo.AddAsync(family);
    }

    public async Task Update(int id, FamilyCreateDto dto)
    {
        var family = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Familia no encontrada");
        dto.Adapt(family);
        await repo.UpdateAsync(family);
    }

    public async Task Delete(int id) => await repo.DeleteAsync(id);
}
