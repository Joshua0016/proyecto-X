using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTOs;

public record MemberUpdateDTO
(
    string Name,
    string? LastName,
    string? PhoneNumber,
    string Email,
    string UrlPhoto,
    DateOnly Birth
);

