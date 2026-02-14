using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;


namespace Backend.Repositories
{
    public class UserRepository(Backend.Data.ApplicationDbContext context) : IGenericRepository<usuario>
    {
        private readonly Backend.Data.ApplicationDbContext _context = context;

        // public UserRepository(Backend.Data.ApplicationDbContext context)
        // {
        //     _context = context;
        // }

        public async Task<IEnumerable<usuario>> GetAllAsync() =>
            await _context.Usuarios.Include(u => u.id_rolNavigation)
                .ToListAsync();


        public async Task<usuario?> GetByEmailAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return null;
            }

            var normalizedEmail = email.ToLower();

            return await _context.Usuarios
                .Include(u => u.id_rolNavigation)
                .FirstOrDefaultAsync(u => u.email.ToLower() == normalizedEmail);
        }

        public async Task<usuario?> GetByIdAsync(int id) =>
            await _context.Usuarios.Include(u => u.id_rolNavigation)
                .FirstOrDefaultAsync(u => u.id_usuario == id);

        public async Task AddAsync(usuario usuario)
        {
            if (usuario == null) throw new ArgumentNullException(nameof(usuario));

            await _context.Usuarios.AddAsync(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(usuario usuario)
        {
            if (usuario == null) throw new ArgumentNullException(nameof(usuario));
            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var usuario = await GetByIdAsync(id);
            if (usuario != null)
            {
                _context.Usuarios.Remove(usuario);
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
            return await _context.Usuarios.AnyAsync(u => u.email.ToLower() == normalizedEmail);

        }

    }
}

