using Backend.DTOs;
using Backend.Repositories;
using Backend.Models;
using Backend.interfaces;
using System.Threading.Tasks;
using Mapster;

namespace Backend.Services;

public class MemberService(IGenericRepository<Member> repo, IGenericRepository<Family> familyRepo) : IMemberService
{

    // use Mapster
    public async Task<IEnumerable<MemberResponseDTO>> ListAll() => (
        await repo.GetAllAsync())
        .Adapt<IEnumerable<MemberResponseDTO>>();

    public async Task Persist(MemberCreateDTO request)
    {
        if (!string.IsNullOrWhiteSpace(request.PhoneNumber) && await repo.ExistsAsync(request.PhoneNumber))
            throw new Exception("Ya existe un miembro con este telefono");

        if (request.FamilyIds is { Count: > 0 })
        {
            var familyId = request.FamilyIds[0];
            var familyExists = await familyRepo.GetByIdAsync(familyId) != null;
            if (!familyExists)
                throw new Exception("La familia especificada no existe");
        }





        var member = request.Adapt<Member>();
        await repo.AddAsync(member);
    }

    public async Task Update(int memberId, MemberUpdateDTO request)
    {
        try
        {
            var miembro = await repo.GetByIdAsync(memberId) ?? throw new Exception("Miembro no encontrado");

            request.Adapt(miembro);
            await repo.UpdateAsync(miembro);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task Delete(int memberId)
    {
        try
        {
            await repo.DeleteAsync(memberId);
        }
        catch (System.Exception ex)
        {
            throw new Exception(ex.Message);

        }


    }

    public async Task IsActive(int memberId){
        var member = await repo.GetByIdAsync(memberId)
            ?? throw new KeyNotFoundException(" Miembro no encontrado")

        member.IsActive = true;
        repo.UpdateAsync(member);
    }






}