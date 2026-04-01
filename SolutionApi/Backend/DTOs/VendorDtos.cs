using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record VendorCreateDto(
    [Required][StringLength(100, MinimumLength = 3)] string Name,
    [Required][RegularExpression(@"^(\d{9}|\d{11})$", ErrorMessage = "El RNC debe tener 9 u 11 dígitos")] string TaxId,
    [Required][StringLength(100, MinimumLength = 10)] string Address,
    [Required][RegularExpression(@"^\d{11}$", ErrorMessage = "El número de teléfono debe tener 11 dígitos")] string PhoneNumber
);

public record VendorResponseDTO(
    int VendorId,
    string Name,
    string TaxId,
    string Address,
    string PhoneNumber
);

public record VendorUpdateDto(
    [Required][StringLength(100, MinimumLength = 3)] string Name,
    [Required][StringLength(100, MinimumLength = 10)] string Address,
    [Required][RegularExpression(@"^\d{11}$", ErrorMessage = "El número de teléfono debe tener 11 dígitos")] string PhoneNumber
);
