using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class FamilyService(FamilyRepository repo, MemberRepository memberRepo) : IFamilyService
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

    public async Task Update(int id, FamilyCreateDto dto)
    {
        var family = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Familia no encontrada");
        dto.Adapt(family);
        await repo.UpdateAsync(family);
    }

    public async Task Delete(int id) => await repo.DeleteAsync(id);

    public async Task AddMemberToFamily(int familyId, int memberId)
    {
        var family = await repo.GetByIdAsync(familyId)
            ?? throw new KeyNotFoundException("Familia no encontrada");
        var member = await memberRepo.GetByIdAsync(memberId)
            ?? throw new KeyNotFoundException("Miembro no encontrado");

        if (member.FamilyId != null)
            throw new ArgumentException("El miembro ya está asociado a una familia");

        member.FamilyId = familyId;
        await memberRepo.UpdateAsync(member);
    }

    public async Task RemoveMemberFromFamily(int familyId, int memberId)
    {
        var family = await repo.GetByIdAsync(familyId)
            ?? throw new KeyNotFoundException("Familia no encontrada");
        var member = await memberRepo.GetByIdAsync(memberId)
            ?? throw new KeyNotFoundException("Miembro no encontrado");

        if (member.FamilyId == null)
            throw new ArgumentException("El miembro no está asociado a una familia");

        member.FamilyId = null;
        await memberRepo.UpdateAsync(member);
    }

}
