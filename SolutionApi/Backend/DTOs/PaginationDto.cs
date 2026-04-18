namespace Backend.DTOs;

// Parámetros de entrada para cualquier endpoint paginado
public record PagedRequestDto(
    int Page = 1,
    int PageSize = 10
);

// Respuesta genérica paginada
public record PagedResponseDto<T>(
    IEnumerable<T> Data,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages
);
