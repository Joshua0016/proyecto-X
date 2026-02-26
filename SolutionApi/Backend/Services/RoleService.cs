using System;
using Backend.Repositories;
using Backend.Models;
using Backend.interfaces;

using Backend.DTOs;
using Backend.Services;
namespace Backend.Services;

public class RoleService(IGenericRepository<Role> repo) : IRole
{
    private readonly IGenericRepository<Role> _repo = repo;

    public async Task<IEnumerable<RolesResponseDTO>> ListAll() => (
        await repo.GetAllAsync()).Select(m => new RolesResponseDTO(
            m.RoleId,
            m.Name,
            m.Description
        ));


    public async Task Persist(RoleCreateDTO request)
    {
        if (await repo.ExistsAsync(request.Name))

            throw new Exception("Ya existe");

        await repo.AddAsync(new Role
        {
            Name = request.Name,
            Description = request.Description
        });
    }

    public async Task Update(int id)
    {
        try
        {
            var r = await repo.GetByIdAsync(id) ?? throw new Exception("Miembro no encontrado");
            await repo.UpdateAsync(r);

        }
        catch (Exception ex)
        {

            throw new Exception(ex.Message);

        }
    }

    public async Task Delete(int id)
    {
        await repo.DeleteAsync(id);

    }


}

