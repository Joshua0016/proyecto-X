using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Backend.interfaces;


namespace Backend.Repositories
{
    public class UserRepository(DbProyectoXContext context) : IGenericRepository<User>
    {
        private readonly DbProyectoXContext _context = context;

        // public UserRepository(Backend.Data.ApplicationDbContext context)
        // {
        //     _context = context;
        // }

        public async Task<IEnumerable<User>> GetAllAsync() =>
            await _context.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .ToListAsync();


        public async Task<User?> GetByEmailAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return null;
            }

            var normalizedEmail = email.ToLower();

            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
        }

        public async Task<User?> GetByIdAsync(int id) =>
            await _context.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == id);

        public async Task AddAsync(User usuario)
        {
            if (usuario == null) throw new ArgumentNullException(nameof(usuario));

            await _context.Users.AddAsync(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(User usuario)
        {
            if (usuario == null) throw new ArgumentNullException(nameof(usuario));
            _context.Users.Update(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var usuario = await GetByIdAsync(id);
            if (usuario != null)
            {
                _context.Users.Remove(usuario);
                await _context.SaveChangesAsync();
            }

        }

        public async Task<bool> ExistsAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return false;
            }
            var normalizedEmail = email.ToLower();
            return await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
        }



    }
}
