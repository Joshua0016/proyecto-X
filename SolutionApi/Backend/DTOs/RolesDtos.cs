
namespace Backend.DTOs;

public record RolesResponseDTO
(
    int IdRol,
    string Nombre,
    string? Descripcion
);

public record RoleCreateDTO
(
    string Name,
    string? Description
);