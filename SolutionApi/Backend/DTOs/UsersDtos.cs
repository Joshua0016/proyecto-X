namespace Backend.DTOs;

public record LoginRequestDTO
(
    string Email,
    string Password
 );

public record LoginResponseDTO(
   string Token,
   string Email,
   string Rol
);

public record RegisterRequestDto(
string Email,
string Password,
int IdRol
);

public record UserResponseDTO
(
    int IdUsuario,
    string Email,
    string RolNombre,
    DateTimeOffset FechaCreacion
);


