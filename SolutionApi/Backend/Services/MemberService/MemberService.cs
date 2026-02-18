using Backend.DTOs;
using Backend.Repositories;
using Backend.Models;
using System.Threading.Tasks;


namespace Backend.Services;



public class MemberService(IGenericRepository<Member> repo) : IMemberService
{
    private readonly IGenericRepository<Member> _repo = repo;

    public async Task<IEnumerable<MemberResponseDTO>> ListAll() => (
        await repo.GetAllAsync())
            .Select(m => new MemberResponseDTO(

                 m.MemberId,
                 m.FirstName,
                 m.LastName
            ));


    public async Task Persist(MemberCreateDTO request)
    {
        if (await repo.ExistsAsync(request.Telephon))

            throw new Exception("Ya existe");

        await repo.AddAsync(new Member
        {
            FirstName = request.Name,
            LastName = request.LastName,
            PhoneNumber = request.Telephon,
            Email = request.Email,
            PhotoUrl = request.UrlPhoto,
            BirthDate = request.Birth
        });
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