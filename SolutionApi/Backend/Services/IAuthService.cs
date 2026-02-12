using Backend.DTOs;

namespace Backend.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterRequestDto request);
        Task<LoginResponseDTO?> LoginAsync(LoginRequestDTO request);
        Task<IEnumerable<UserResponseDTO>> GetUsersAsync();

    }
}
