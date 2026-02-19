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
                 m.LastName,
                 m.PhoneNumber,
                 m.Email,
                 m.PhotoUrl,
                 m.BirthDate
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

  public async Task Update(int id, MemberUpdateDTO dto)
    {
        var m = await _repo.GetByIdAsync(id) ?? throw new Exception("Miembro no encontrado");
        //Aplicar cambios aqui gadi
        m.FirstName = dto.Name;
        m.LastName = dto.LastName;
        m.Email = dto.Email;
        m.PhoneNumber = dto.Telephon;
        m.PhotoUrl = dto.UrlPhoto;
        m.BirthDate = dto.Birth;

        await _repo.UpdateAsync(m);

    }
    public async Task Delete(int id_)
    {
        await repo.DeleteAsync(id_);

    }






}