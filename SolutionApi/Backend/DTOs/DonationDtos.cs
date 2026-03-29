using System.ComponentModel.DataAnnotations;
using Backend.commons;

namespace Backend.DTOs;

public record DonationCreateDto(
    [Required] int MemberId,
    [Required][Range(0.01, 999999999.99)] decimal Amount,
    [Required] DateTime Date,
    [Required] DonationType Type,
    [Required] DonationPaymentMethod PaymentMethod,
    DonationStatus Status = DonationStatus.Completed
);

public record DonationResponseDTO(
    int DonationId,
    int MemberId,
    string MemberName,
    decimal Amount,
    DateTime Date,
    string Type,
    string PaymentMethod,
    string Status,
    string? TaxReceiptCode
);

public record DonationUpdateDto(
    [Required][Range(0.01, 999999999.99)] decimal Amount,
    [Required] DonationStatus Status
);
