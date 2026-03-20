using Backend.DTOs;
using Backend.Models;


namespace Backend.interfaces
{
    public interface IJwtService
    {

        // Entity
        string GenerateToken(LoginResponseDTO request);
    }
}