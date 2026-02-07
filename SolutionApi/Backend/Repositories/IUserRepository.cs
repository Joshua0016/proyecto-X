using Backend.Models;
using System.Threading.Tasks;


namespace Backend.Repositories
{
    public interface IUserRepository
    {
        Task<Usuario?> GetByEmailAsync(string email);
    }
}
