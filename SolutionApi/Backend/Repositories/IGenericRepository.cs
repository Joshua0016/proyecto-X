using Backend.Models;
using System.Threading.Tasks;


namespace Backend.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T?> GetByEmailAsync(string email);
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(string email);
    }
}
