using Backend.Models;
using System.Threading.Tasks;


namespace Backend.interfaces
{
    public interface IGenericRepository<T>
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(string t);

        // Task <T> GetByEmailAsync(string email);

    }
}
