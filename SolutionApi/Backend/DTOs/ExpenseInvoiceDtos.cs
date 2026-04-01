using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record ExpenseInvoiceCreateDto(
    [Required] int VendorId,
    [Required][StringLength(50)] string InvoiceNumber,
    [Required][Range(0.01, 999999999.99)] decimal Total,
    [Required] DateOnly IssueDate,
    [Required] DateOnly DueDate,
    [Required][RegularExpression(@"^(Pending|Paid|Cancelled|Overdue)$", ErrorMessage = "Estado inválido")] string Status,
    [Required] int JournalEntryId
);

public record ExpenseInvoiceResponseDTO(
    int ExpenseInvoiceId,
    int VendorId,
    string VendorName,
    string InvoiceNumber,
    decimal Total,
    DateOnly IssueDate,
    DateOnly DueDate,
    string Status,
    int JournalEntryId
);

public record ExpenseInvoiceUpdateDto(
    [Required][StringLength(50)] string InvoiceNumber,
    [Required][Range(0.01, 999999999.99)] decimal Total,
    [Required] DateOnly IssueDate,
    [Required] DateOnly DueDate,
    [Required][RegularExpression(@"^(Pending|Paid|Cancelled|Overdue)$", ErrorMessage = "Estado inválido")] string Status
);
