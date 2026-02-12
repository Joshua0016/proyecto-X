using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public record LoginRequestDTO
    (
        string Email,
        string Password
     );

}
