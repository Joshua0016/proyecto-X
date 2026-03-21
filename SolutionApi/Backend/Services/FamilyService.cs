using Backend.Models;
using Backend.DTOs;
using Backend.interfaces;
using Mapster;


namespace Backend.Services;


public class FamilyService(IGenericRepository<Family> repo) : IFamilyService
{

    public async Task<IEnumerable<FamilyResponseDTO>> ListAll() => (
        await repo.GetAllAsync()).
        Adapt<IEnumerable<FamilyResponseDTO>>();

    public async Task Persist(FamilyCreateDto dto)
    {
        try
        {
            if (await repo.ExistsAsync(dto.PhoneNumber))
                throw new Exception("Ya existe");

            var family = dto.Adapt<Family>();
            await repo.AddAsync(family);

        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);

        }

    }

    public async Task Update(int id, FamilyCreateDto dto)
    {
        try
        {
            var family = await repo.GetByIdAsync(id) ?? throw new Exception("Miembro no encontrado");
            dto.Adapt(family);
            await repo.UpdateAsync(family);


        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);

        }
    }

    public async Task Delete(int id)
    {
        try
        {
            await repo.DeleteAsync(id);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);

        }

    }

}