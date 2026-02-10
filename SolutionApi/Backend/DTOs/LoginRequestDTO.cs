using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class LoginRequestDTO
    {
        [Required]
        [EmailAddress]

        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        //public bool RememberMe { get; set; } = false;
    }
}
