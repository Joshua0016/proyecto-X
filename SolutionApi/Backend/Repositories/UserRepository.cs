using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;


namespace Backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly Backend.Data.ApplicationDbContext _context;

        public UserRepository(Backend.Data.ApplicationDbContext context)
        {
            _context = context;
        }

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
    }
}
