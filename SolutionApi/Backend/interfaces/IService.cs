using Backend.DTOs;
using Backend.Models;

namespace Backend.interfaces;

public interface IService
{
    Task<string> RegisterAsync(RegisterRequestDto request);
    Task<User> LoginAsync(LoginRequestDTO request);
    Task<IEnumerable<UserResponseDTO>> ListAllAsync();
    Task<UserResponseDTO> GetByIdAsync(int id);
    Task UpdateAsync(int id, UserUpdateDto request);
    Task ChangePasswordAsync(int id, ChangePasswordDto request);
    Task DeactivateAsync(int id);
}
