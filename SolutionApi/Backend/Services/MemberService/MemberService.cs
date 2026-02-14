using Backend.DTOs;
using Backend.Repositories;
using Backend.Models;
using System.Threading.Tasks;


namespace Backend.Services;



public class MemberService(IGenericRepository<Miembro> repo) : IMemberService
{
    private readonly IGenericRepository<Miembro> _repo = repo;

    public async Task<IEnumerable<MemberResponseDTO>> ListAll() => (
        await repo.GetAllAsync())
            .Select(m => new MemberResponseDTO(

                 m.IdMiembro,
                 m.Nombre,
                 m.Apellido
            ));


    public async Task Persist(MemberCreateDTO request)
    {
        try
        {
            if (await repo.ExistsAsync(request.Telefono)) throw new Exception("Ya existe ");
            await repo.AddAsync(new Miembro
            {
                Nombre = request.Nombre,
                Apellido = request.Apellido,
                Telefono = request.Telefono,
                IdUsuario = request.IdUsuario,
                IdFamilia = request.IdFamilia
            });
        }
        catch (Exception ex)
        {

            throw new Exception(ex.Message);

        }
    }

    public async Task Update(int id)
    {
        try
        {
            var m = await _repo.GetByIdAsync(id) ?? throw new Exception("Miembro no encontrado");
            await repo.UpdateAsync(m);
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