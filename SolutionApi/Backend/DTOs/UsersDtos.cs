using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record LoginRequestDTO(
    [Required][EmailAddress] string Email,
    [Required] string Password
);

public record LoginResponseDTO(
    int UserId,
    string Name,
    string Token,
    string RefreshToken,
    string Email,
    string Rol
);

public record RefreshTokenRequestDto(string RefreshToken);

public record RegisterRequestDto(
    [Required][StringLength(100, MinimumLength = 3)] string Name,
    [Required][EmailAddress] string Email,
    [Required][StringLength(100, MinimumLength = 8)] string Password,
    [Required] int IdRol
);

public record UserResponseDTO(
    int UserId,
    string Name,
    string Email,
    string RolNombre,
    bool Active,
    DateTime CreatedAt
);

public record UserUpdateDto(
    [Required][StringLength(100, MinimumLength = 3)] string Name,
    [Required][EmailAddress] string Email,
    [Required] int IdRol
);

public record ChangePasswordDto(
    [Required] string CurrentPassword,
    [Required][StringLength(100, MinimumLength = 8)] string NewPassword
);
