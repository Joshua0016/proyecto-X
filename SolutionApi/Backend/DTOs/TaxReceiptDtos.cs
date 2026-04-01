using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record TaxReceiptCreateDto(
    [Required][StringLength(50, MinimumLength = 5)][RegularExpression(@"^[A-Z0-9]+$", ErrorMessage = "El código solo debe contener letras mayúsculas y números")] string Code,
    [Required] int DonationId,
    [Required] DateOnly IssueDate
);

public record TaxReceiptResponseDTO(
    int TaxReceiptId,
    string Code,
    int DonationId,
    string? DonorName,
    decimal DonationAmount,
    DateOnly IssueDate
);
