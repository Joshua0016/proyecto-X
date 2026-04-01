using Backend.Models;
using System.Threading.Tasks;


namespace Backend.interfaces
{
    public interface IGenericRepository<T>
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task<T?> GetByEmailAsync(string email) => Task.FromResult(default(T));
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(string t);
    }
}
