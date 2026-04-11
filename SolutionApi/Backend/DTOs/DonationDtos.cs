using System.ComponentModel.DataAnnotations;
using Backend.commons;

namespace Backend.DTOs;

// --- DonationItem DTOs ---

public record DonationItemCreateDTO(
    [Required] int DonationItemTypeId,
    int? Quantity,
    UnitOfMeasure? UnitOfMeasure,
    [Required][Range(0.01, 999999999.99)] decimal Amount,
    [Required] PaymentMethod PaymentMethod,
    DonationStatus? Status
);

public record DonationItemResponseDTO(
    int DonationItemId,
    int DonationId,
    int DonationItemTypeId,
    int? Quantity,
    UnitOfMeasure? UnitOfMeasure,
    decimal Amount,
    PaymentMethod PaymentMethod,
    DonationStatus? Status
);

// --- Donation DTOs ---

public record DonationCreateDTO(
    [Required] int MemberId,
    [Required] DateTime Date,
    int? EventId,
    string? Observation,
    List<DonationItemCreateDTO>? Items
);

public record DonationResponseDTO(
    int DonationId,
    int MemberId,
    int? EventId,
    DateTime Date,
    string? Observation,
    List<DonationItemResponseDTO>? Items
);

public record DonationUpdateDTO(
    [Required] int MemberId,
    int? EventId,
    [Required] DateTime Date,
    string? Observation
);
