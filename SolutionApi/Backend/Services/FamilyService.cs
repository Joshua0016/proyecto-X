using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class FamilyService(FamilyRepository repo) : IFamilyService
{
    public async Task<IEnumerable<FamilyDetailDTO>> ListAll() =>
        (await repo.GetAllAsync()).Adapt<IEnumerable<FamilyDetailDTO>>();

    public async Task<FamilyDetailDTO?> GetById(int familyId)
    {
        var family = await repo.GetByIdAsync(familyId);
        return family?.Adapt<FamilyDetailDTO>();
    }

    public async Task<IEnumerable<FamilyDetailDTO>> Search(string? query) =>
        (await repo.SearchAsync(query)).Adapt<IEnumerable<FamilyDetailDTO>>();

    public async Task Persist(FamilyCreateDto dto)
    {
        List<Member>? members = new();

        if (dto.MemberIds != null && dto.MemberIds.Any())
        {
            members = await repo.GetByIdsAsync(dto.MemberIds);

            if (members.Count != dto.MemberIds.Count)
                throw new ArgumentException("Algunos MemberIds no existen");

            if (members.Any(m => m.FamilyId != null))
                throw new ArgumentException("Algunos MemberIds ya están asociados a una familia");

        }
        var family = dto.Adapt<Family>();
        family.Members = members;
        family.CreatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified);
        await repo.AddAsync(family);
    }

    public async Task Update(int familyId, FamilyCreateDto dto)
    {
        var family = await repo.GetByIdAsync(familyId)
            ?? throw new KeyNotFoundException("Familia no encontrada");
        dto.Adapt(family);
        await repo.UpdateAsync(family);
    }

    public async Task Delete(int familyId) => await repo.DeleteAsync(familyId);



}
