using Backend.Models;
using System.Threading.Tasks;


namespace Backend.Repositories
{
    public interface IUserRepository
    {
        Task<usuario?> GetByEmailAsync(string email);
        Task<IEnumerable<usuario>> GetAllAsync();
        Task<usuario?> GetByIdAsync(int id);
        Task AddAsync(usuario usuario);
        Task UpdateAsync(usuario usuario);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(string email);
    }
}
