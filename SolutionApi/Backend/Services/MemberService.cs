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
        var member = await repo.GetByIdAsync(memberId)
            ?? throw new KeyNotFoundException("Miembro no encontrado");

        // Verificar si tiene asistencias registradas
        if (member.Attendances != null && member.Attendances.Any())
            throw new InvalidOperationException(
                "No se puede eliminar este miembro porque tiene registros de asistencia. Considere desactivarlo en su lugar.");

        await repo.DeleteAsync(memberId);
    }

    public async Task Active(int memberId)
    {
        var member = await repo.GetByIdAsync(memberId)
            ?? throw new KeyNotFoundException(" Miembro no encontrado");

        member.IsActive = true;
        await repo.UpdateAsync(member);
    }

    public async Task Deactive(int memberId)
    {
        var member = await repo.GetByIdAsync(memberId)
            ?? throw new KeyNotFoundException(" Miembro no encontrado");

        member.IsActive = false;
        await repo.UpdateAsync(member);
    }






}