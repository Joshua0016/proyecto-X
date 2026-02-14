using Backend.DTOs;
using Backend.Models;

namespace Backend.Services
{
    public interface IService
    {
        Task<string> RegisterAsync(RegisterRequestDto request);
        Task<usuario> LoginAsync(LoginRequestDTO request);
        // Task<IEnumerable<UserResponseDTO>> GetUsersAsync();

    }
}
