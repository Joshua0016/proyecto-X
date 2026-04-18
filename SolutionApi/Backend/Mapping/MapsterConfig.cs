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
            .Map(dest => dest.RolNombre, src => src.UserRoles.FirstOrDefault() != null && src.UserRoles.First().Role != null
                ? src.UserRoles.First().Role.Name : string.Empty);

        // // AuditLog → AuditLogResponseDTO
        // TypeAdapterConfig<AuditLog, AuditLogResponseDTO>.NewConfig()
        //     .Map(dest => dest.UserName, src => src.User != null ? src.User.Name : string.Empty);

        // Member mappings: all property names match by convention
        TypeAdapterConfig<Member, MemberResponseDTO>.NewConfig();
        TypeAdapterConfig<MemberCreateDTO, Member>.NewConfig();
        TypeAdapterConfig<MemberUpdateDTO, Member>.NewConfig();

        TypeAdapterConfig<Role, RolesResponseDTO>.NewConfig()
            .Map(dest => dest.IdRol, src => src.RoleId)
            .Map(dest => dest.Nombre, src => src.Name)
            .Map(dest => dest.Descripcion, src => src.Description);

        // TypeAdapterConfig<JournalCreateDto, JournalEntry>.NewConfig()
        //     .Map(dest => dest.Date, src => DateTime.SpecifyKind(src.Date, DateTimeKind.Unspecified));

        TypeAdapterConfig<LedgerAccountCreateDto, LedgerAccount>.NewConfig()
            .Map(dest => dest.IsActive, src => true)
            .Map(dest => dest.CurrentBalance, src => 0m);

        // Family → FamilyResponseDTO / FamilyDetailDTO con miembros y relación
        TypeAdapterConfig<FamilyMember, FamilyMemberResponseDTO>.NewConfig()
            .Map(dest => dest.MemberId,       src => src.Member.MemberId)
            .Map(dest => dest.FirstName,      src => src.Member.FirstName)
            .Map(dest => dest.SecondName,     src => src.Member.SecondName)
            .Map(dest => dest.LastName,       src => src.Member.LastName)
            .Map(dest => dest.SecondLastName, src => src.Member.SecondLastName)
            .Map(dest => dest.PhoneNumber,    src => src.Member.PhoneNumber)
            .Map(dest => dest.Email,          src => src.Member.Email)
            .Map(dest => dest.BirthDate,      src => src.Member.BirthDate)
            .Map(dest => dest.Gender,         src => src.Member.Gender)
            .Map(dest => dest.MaritalStatus,  src => src.Member.MaritalStatus)
            .Map(dest => dest.PhotoUrl,       src => src.Member.PhotoUrl)
            .Map(dest => dest.NationalId,     src => src.Member.NationalId)
            .Map(dest => dest.BloodType,      src => src.Member.BloodType)
            .Map(dest => dest.Address,        src => src.Member.Address)
            .Map(dest => dest.MemberType,     src => src.Member.MemberType)
            .Map(dest => dest.IsActive,       src => src.Member.IsActive)
            .Map(dest => dest.Baptized,       src => src.Member.Baptized)
            .Map(dest => dest.JoinDate,       src => src.Member.JoinDate)
            .Map(dest => dest.Profession,     src => src.Member.Profession)
            .Map(dest => dest.Occupation,     src => src.Member.Occupation)
            .Map(dest => dest.AcademicLevel,  src => src.Member.AcademicLevel)
            .Map(dest => dest.Relationship,   src => src.Relationship);

        TypeAdapterConfig<Family, FamilyResponseDTO>.NewConfig()
            .Map(dest => dest.Members, src => src.FamilyMembers.Adapt<IEnumerable<FamilyMemberResponseDTO>>());

        TypeAdapterConfig<Family, FamilyDetailDTO>.NewConfig()
            .Map(dest => dest.Members, src => src.FamilyMembers.Adapt<IEnumerable<FamilyMemberResponseDTO>>());

        // Vendor → VendorResponseDTO (nombres coinciden, Mapster lo hace automático)
        TypeAdapterConfig<VendorCreateDto, Vendor>.NewConfig();

        // Event → EventResponseDTO: OrganizerName viene de navegación
        TypeAdapterConfig<Event, EventResponseDTO>.NewConfig()
            .Map(dest => dest.OrganizerName, src => src.OrganizerUser != null ? src.OrganizerUser.Name : null);

        TypeAdapterConfig<EventCreateDto, Event>.NewConfig()
            .Map(dest => dest.StartDate, src => DateTime.SpecifyKind(src.StartDate, DateTimeKind.Utc))
            .Map(dest => dest.EndDate, src => DateTime.SpecifyKind(src.EndDate, DateTimeKind.Utc));

        TypeAdapterConfig<EventUpdateDto, Event>.NewConfig()
            .Map(dest => dest.StartDate, src => DateTime.SpecifyKind(src.StartDate, DateTimeKind.Utc))
            .Map(dest => dest.EndDate, src => DateTime.SpecifyKind(src.EndDate, DateTimeKind.Utc));

        TypeAdapterConfig<Attendance, AttendanceResponseDTO>.NewConfig()
            .Map(dest => dest.EventTitle, src => src.Event != null ? src.Event.Title : string.Empty)
            .Map(dest => dest.MemberName, src => src.Member != null
                ? $"{src.Member.FirstName} {src.Member.LastName}".Trim()
                : string.Empty);

        TypeAdapterConfig<AttendanceCreateDto, Attendance>.NewConfig()
            .Map(dest => dest.EntryTime, src => src.EntryTime.HasValue
                ? DateTime.SpecifyKind(src.EntryTime.Value, DateTimeKind.Utc) : (DateTime?)null)
            .Map(dest => dest.ExitTime, src => src.ExitTime.HasValue
                ? DateTime.SpecifyKind(src.ExitTime.Value, DateTimeKind.Utc) : (DateTime?)null);

        // Donation → DonationResponseDTO: map DonationItems collection to Items
        TypeAdapterConfig<Donation, DonationResponseDTO>.NewConfig()
            .Map(dest => dest.Items, src => src.DonationItems);

        // DonationCreateDTO → Donation: map Items to DonationItems
        TypeAdapterConfig<DonationCreateDTO, Donation>.NewConfig()
            .Map(dest => dest.DonationItems, src => src.Items);

        // DonationItem ↔ DonationItem DTOs: all property names match by convention
        TypeAdapterConfig<DonationItem, DonationItemResponseDTO>.NewConfig();
        TypeAdapterConfig<DonationItemCreateDTO, DonationItem>.NewConfig();

        TypeAdapterConfig<TaxReceipt, TaxReceiptResponseDTO>.NewConfig()
            .Map(dest => dest.DonorName, src => src.Donation != null && src.Donation.Member != null
                ? $"{src.Donation.Member.FirstName} {src.Donation.Member.LastName}".Trim()
                : null)
            .Map(dest => dest.DonationAmount, src => src.Donation != null
                ? src.Donation.DonationItems.Sum(i => i.Amount)
                : 0)
            .Map(dest => dest.IssueDate, src => DateOnly.FromDateTime(src.IssueDate));

        TypeAdapterConfig<ExpenseInvoice, ExpenseInvoiceResponseDTO>.NewConfig()
            .Map(dest => dest.VendorName, src => src.Vendor != null ? src.Vendor.Name : string.Empty)
            .Map(dest => dest.IssueDate, src => DateOnly.FromDateTime(src.IssueDate))
            .Map(dest => dest.DueDate, src => DateOnly.FromDateTime(src.DueDate));
    }
}
