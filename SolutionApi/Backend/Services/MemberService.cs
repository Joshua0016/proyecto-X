using Backend.DTOs;
using Backend.Repositories;
using Backend.Models;
using Backend.interfaces;
using System.Threading.Tasks;
using Mapster;

namespace Backend.Services;

public class MemberService(IGenericRepository<Member> repo) : IMemberService
{

    // use Mapster
    public async Task<IEnumerable<MemberResponseDTO>> ListAll() => (
        await repo.GetAllAsync())
        .Adapt<IEnumerable<MemberResponseDTO>>();

    public async Task Persist(MemberCreateDTO request)
    {
        if (await repo.ExistsAsync(request.PhoneNumber))

            throw new Exception("Ya existe un miembro con este telefono");

        if (request.FamilyId == 0)
            throw new Exception("El miembro debe pertenecer a una familia");

        if (request.FamilyId != null)
        {
            var familyExists = await repo.ExistsAsync(request.LastName);
            if (!familyExists)
                throw new Exception("La familia especificada no existe");
        }





        var member = request.Adapt<Member>();
        await repo.AddAsync(member);
    }

    public async Task Update(int id, MemberUpdateDTO request)
    {
        try
        {
            var miembro = await repo.GetByIdAsync(id) ?? throw new Exception("Miembro no encontrado");

            request.Adapt(miembro);
            await repo.UpdateAsync(miembro);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task Delete(int id_)
    {
        try
        {
            await repo.DeleteAsync(id_);
        }
        catch (System.Exception ex)
        {
            throw new Exception(ex.Message);

        }


    }






}