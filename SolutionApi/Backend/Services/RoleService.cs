using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Mapster;

namespace Backend.Services;

public class RoleService(IGenericRepository<Role> repo) : IRole
{
    public async Task<IEnumerable<RolesResponseDTO>> ListAll() =>
        (await repo.GetAllAsync()).Adapt<IEnumerable<RolesResponseDTO>>();

    public async Task Persist(RoleCreateDTO request)
    {
        if (await repo.ExistsAsync(request.Name))
            throw new Exception("El rol ya existe");

        await repo.AddAsync(request.Adapt<Role>());
    }

    public async Task Update(int id)
    {
        var role = await repo.GetByIdAsync(id) ?? throw new Exception("Rol no encontrado");
        await repo.UpdateAsync(role);
    }

    public async Task Delete(int id)
    {
        await repo.DeleteAsync(id);
    }
}
