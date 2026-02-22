using Backend.DTOs;
using Backend.Models;

namespace Backend.interfaces
{

    public interface IService
    {
        Task<string> RegisterAsync(RegisterRequestDto request);
        Task<User> LoginAsync(LoginRequestDTO request);
        // Task<IEnumerable<UserResponseDTO>> GetUsersAsync();

    }
}
