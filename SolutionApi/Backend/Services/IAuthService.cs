using Backend.DTOs;

namespace Backend.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDTO?> AuthenticateAsync(LoginRequestDTO request);

    }
}
