using Backend.Models;


namespace Backend.interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}