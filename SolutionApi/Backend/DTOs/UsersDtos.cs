namespace Backend.DTOs;

public record LoginRequestDTO
(
    string Email,
    string Password
 );

public record LoginResponseDTO(
   int UserId,
   string Token,
   string Email,
   string Rol
);

public record RegisterRequestDto(
    string Name,
    string Email,
    string Password,
    int IdRol
);

public record UserResponseDTO
(
    int UserId,
    string Email,
    string RolNombre,
    DateTimeOffset FechaCreacion
);


