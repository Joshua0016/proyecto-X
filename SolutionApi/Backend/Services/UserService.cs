using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Mapster;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services;

public class UserService(IGenericRepository<User> userRepository, IPasswordHasher<User> hasher) : IService
{
    public async Task<IEnumerable<UserResponseDTO>> ListAllAsync() =>
        (await userRepository.GetAllAsync()).Adapt<IEnumerable<UserResponseDTO>>();

    public async Task<UserResponseDTO> GetByIdAsync(int id)
    {
        var user = await userRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Usuario no encontrado");
        return user.Adapt<UserResponseDTO>();
    }

    public async Task<string> RegisterAsync(RegisterRequestDto request)
    {
        if (await userRepository.ExistsAsync(request.Email))
            throw new InvalidOperationException("Ya existe un usuario con ese correo");

        var user = new User
        {
            Name      = request.Name,
            Email     = request.Email,
            RoleId    = request.IdRol,
            Active    = true,
            CreatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified)
        };

        user.Password = hasher.HashPassword(user, request.Password);
        await userRepository.AddAsync(user);
        return "Usuario registrado exitosamente";
    }

    public async Task<User> LoginAsync(LoginRequestDTO request)
    {
        var user = await userRepository.GetByEmailAsync(request.Email)
            ?? throw new UnauthorizedAccessException("Credenciales inválidas");

        if (!user.Active)
            throw new UnauthorizedAccessException("El usuario está desactivado");

        var result = hasher.VerifyHashedPassword(user, user.Password, request.Password);

        if (result == PasswordVerificationResult.Failed)
            throw new UnauthorizedAccessException("Credenciales inválidas");

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.Password = hasher.HashPassword(user, request.Password);
            await userRepository.UpdateAsync(user);
        }

        return user;
    }

    public async Task UpdateAsync(int id, UserUpdateDto request)
    {
        var user = await userRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Usuario no encontrado");

        if (user.Email != request.Email && await userRepository.ExistsAsync(request.Email))
            throw new InvalidOperationException("Ya existe un usuario con ese correo");

        user.Name    = request.Name;
        user.Email   = request.Email;
        user.RoleId  = request.IdRol;
        await userRepository.UpdateAsync(user);
    }

    public async Task ChangePasswordAsync(int id, ChangePasswordDto request)
    {
        var user = await userRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Usuario no encontrado");

        var result = hasher.VerifyHashedPassword(user, user.Password, request.CurrentPassword);
        if (result == PasswordVerificationResult.Failed)
            throw new ArgumentException("La contraseña actual es incorrecta");

        user.Password = hasher.HashPassword(user, request.NewPassword);
        await userRepository.UpdateAsync(user);
    }

    public async Task DeactivateAsync(int id)
    {
        var user = await userRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Usuario no encontrado");

        user.Active = false;
        await userRepository.UpdateAsync(user);
    }
}
