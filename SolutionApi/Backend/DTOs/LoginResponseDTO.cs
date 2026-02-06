using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class LoginResponseDTO
    {


        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }

        public string Username { get; set; } = string.Empty;

        public IEnumerable<string> Roles { get; set; } = Enumerable.Empty<string>();
    }
}
