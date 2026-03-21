using Backend.DTOs;
using Backend.Models;
using Mapster;

namespace Backend.commons;

public static class MapsterConfig
{
    public static void RegisterMappings()
    {
        TypeAdapterConfig<Member, MemberResponseDTO>.NewConfig()
            .Map(dest => dest.Id,        src => src.MemberId)
            .Map(dest => dest.Name,      src => src.FirstName)
            .Map(dest => dest.LastName,  src => src.LastName)
            .Map(dest => dest.PhoneNumber, src => src.PhoneNumber)
            .Map(dest => dest.Email,     src => src.Email)
            .Map(dest => dest.PhotoUrl,  src => src.PhotoUrl)
            .Map(dest => dest.Birth,     src => src.BirthDate);

        TypeAdapterConfig<MemberCreateDTO, Member>.NewConfig()
            .Map(dest => dest.FirstName,   src => src.FirstName)
            .Map(dest => dest.LastName,    src => src.LastName)
            .Map(dest => dest.PhoneNumber, src => src.PhoneNumber)
            .Map(dest => dest.Email,       src => src.Email)
            .Map(dest => dest.PhotoUrl,    src => src.PhotoUrl)
            .Map(dest => dest.BirthDate,   src => src.BirthDate);

        TypeAdapterConfig<MemberUpdateDTO, Member>.NewConfig()
            .Map(dest => dest.FirstName,   src => src.Name)
            .Map(dest => dest.LastName,    src => src.LastName)
            .Map(dest => dest.PhoneNumber, src => src.PhoneNumber)
            .Map(dest => dest.Email,       src => src.Email)
            .Map(dest => dest.PhotoUrl,    src => src.PhotoUrl)
            .Map(dest => dest.BirthDate,   src => src.Birth);

        TypeAdapterConfig<Role, RolesResponseDTO>.NewConfig()
            .Map(dest => dest.IdRol, src => src.RoleId)
            .Map(dest => dest.Nombre, src => src.Name)
            .Map(dest => dest.Descripcion, src => src.Description);

        TypeAdapterConfig<JournalCreateDto, JournalEntry>.NewConfig()
            .Map(dest => dest.Date, src => DateTime.SpecifyKind(src.Date, DateTimeKind.Unspecified));

        TypeAdapterConfig<LedgerAccountCreateDto, LedgerAccount>.NewConfig()
            .Map(dest => dest.IsActive, src => true)
            .Map(dest => dest.CurrentBalance, src => 0m);
    }
}
