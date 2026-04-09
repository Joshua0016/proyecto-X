using Backend.DTOs;
using Backend.Models;
using Mapster;

namespace Backend.commons;

public static class MapsterConfig
{
    public static void RegisterMappings()
    {
        // User → UserResponseDTO
        TypeAdapterConfig<User, UserResponseDTO>.NewConfig()
            .Map(dest => dest.RolNombre, src => src.Role != null ? src.Role.Name : string.Empty);

        // AuditLog → AuditLogResponseDTO
        TypeAdapterConfig<AuditLog, AuditLogResponseDTO>.NewConfig()
            .Map(dest => dest.UserName, src => src.User != null ? src.User.Name : string.Empty);

        TypeAdapterConfig<Member, MemberResponseDTO>.NewConfig()
            .Map(dest => dest.memberId, src => src.MemberId)
            .Map(dest => dest.FirstName, src => src.FirstName)
            .Map(dest => dest.LastName, src => src.LastName)
            .Map(dest => dest.PhoneNumber, src => src.PhoneNumber)
            .Map(dest => dest.Email, src => src.Email)
            .Map(dest => dest.PhotoUrl, src => src.PhotoUrl)
            .Map(dest => dest.BirthDate, src => src.BirthDate);

        TypeAdapterConfig<MemberCreateDTO, Member>.NewConfig()
            .Map(dest => dest.FirstName, src => src.FirstName)
            .Map(dest => dest.LastName, src => src.LastName)
            .Map(dest => dest.PhoneNumber, src => src.PhoneNumber)
            .Map(dest => dest.Email, src => src.Email)
            .Map(dest => dest.PhotoUrl, src => src.PhotoUrl)
            .Map(dest => dest.BirthDate, src => src.BirthDate)
            .Map(dest => dest.FamilyId, src => src.FamilyId);

        TypeAdapterConfig<MemberUpdateDTO, Member>.NewConfig()
            .Map(dest => dest.FirstName, src => src.FirstName)
            .Map(dest => dest.LastName, src => src.LastName)
            .Map(dest => dest.PhoneNumber, src => src.PhoneNumber)
            .Map(dest => dest.Email, src => src.Email)
            .Map(dest => dest.PhotoUrl, src => src.PhotoUrl)
            .Map(dest => dest.BirthDate, src => src.BirthDate)
            .Map(dest => dest.FamilyId, src => src.FamilyId);

        TypeAdapterConfig<Role, RolesResponseDTO>.NewConfig()
            .Map(dest => dest.IdRol, src => src.RoleId)
            .Map(dest => dest.Nombre, src => src.Name)
            .Map(dest => dest.Descripcion, src => src.Description);

        // TypeAdapterConfig<JournalCreateDto, JournalEntry>.NewConfig()
        //     .Map(dest => dest.Date, src => DateTime.SpecifyKind(src.Date, DateTimeKind.Unspecified));

        TypeAdapterConfig<LedgerAccountCreateDto, LedgerAccount>.NewConfig()
            .Map(dest => dest.IsActive, src => true)
            .Map(dest => dest.CurrentBalance, src => 0m);

        // Family → FamilyResponseDTO: campos con nombres distintos e incluye lista de miembros mapeada
        TypeAdapterConfig<Family, FamilyResponseDTO>.NewConfig()
            .Map(dest => dest.FamilyId, src => src.FamilyId)
            .Map(dest => dest.District, src => src.District)
            .Map(dest => dest.Sector, src => src.Sector)
            .Map(dest => dest.Address, src => src.Address)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            .Map(dest => dest.Members, src => src.Members.Adapt<IEnumerable<MemberResponseDTO>>());


        // Family → FamilyDetailDTO: incluye lista de miembros mapeada
        TypeAdapterConfig<Family, FamilyDetailDTO>.NewConfig()
            .Map(dest => dest.FamilyId, src => src.FamilyId)
            .Map(dest => dest.District, src => src.District)
            .Map(dest => dest.Sector, src => src.Sector)
            .Map(dest => dest.Address, src => src.Address)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            .Map(dest => dest.Members, src => src.Members.Adapt<IEnumerable<MemberResponseDTO>>());

        // Vendor → VendorResponseDTO (nombres coinciden, Mapster lo hace automático)
        TypeAdapterConfig<VendorCreateDto, Vendor>.NewConfig();

        // Event → EventResponseDTO: OrganizerName viene de navegación
        TypeAdapterConfig<Event, EventResponseDTO>.NewConfig()
            .Map(dest => dest.OrganizerName, src => src.OrganizerUser != null ? src.OrganizerUser.Name : null);

        TypeAdapterConfig<EventCreateDto, Event>.NewConfig()
            .Map(dest => dest.StartDate, src => DateTime.SpecifyKind(src.StartDate, DateTimeKind.Utc))
            .Map(dest => dest.EndDate,   src => DateTime.SpecifyKind(src.EndDate, DateTimeKind.Utc));

        TypeAdapterConfig<EventUpdateDto, Event>.NewConfig()
            .Map(dest => dest.StartDate, src => DateTime.SpecifyKind(src.StartDate, DateTimeKind.Utc))
            .Map(dest => dest.EndDate,   src => DateTime.SpecifyKind(src.EndDate, DateTimeKind.Utc));

        // Attendance → AttendanceResponseDTO: campos calculados de navegación
        TypeAdapterConfig<Attendance, AttendanceResponseDTO>.NewConfig()
            .Map(dest => dest.EventTitle,  src => src.Event != null ? src.Event.Title : string.Empty)
            .Map(dest => dest.MemberName,  src => src.Member != null
                ? $"{src.Member.FirstName} {src.Member.LastName}".Trim()
                : string.Empty);

        TypeAdapterConfig<AttendanceCreateDto, Attendance>.NewConfig()
            .Map(dest => dest.EntryTime, src => src.EntryTime.HasValue
                ? DateTime.SpecifyKind(src.EntryTime.Value, DateTimeKind.Utc) : (DateTime?)null)
            .Map(dest => dest.ExitTime, src => src.ExitTime.HasValue
                ? DateTime.SpecifyKind(src.ExitTime.Value, DateTimeKind.Utc) : (DateTime?)null);

        // TaxReceipt → TaxReceiptResponseDTO: campos calculados de navegación
        TypeAdapterConfig<TaxReceipt, TaxReceiptResponseDTO>.NewConfig()
            .Map(dest => dest.DonorName, src => src.Donation != null && src.Donation.Member != null
                ? $"{src.Donation.Member.FirstName} {src.Donation.Member.LastName}".Trim()
                : null)
            .Map(dest => dest.DonationAmount, src => src.Donation != null ? src.Donation.Amount : 0)
            .Map(dest => dest.IssueDate, src => DateOnly.FromDateTime(src.IssueDate));

        // ExpenseInvoice → ExpenseInvoiceResponseDTO
        TypeAdapterConfig<ExpenseInvoice, ExpenseInvoiceResponseDTO>.NewConfig()
            .Map(dest => dest.VendorName, src => src.Vendor != null ? src.Vendor.Name : string.Empty)
            .Map(dest => dest.IssueDate,  src => DateOnly.FromDateTime(src.IssueDate))
            .Map(dest => dest.DueDate,    src => DateOnly.FromDateTime(src.DueDate));
    }
}
