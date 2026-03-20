using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

using System.Text;
using Backend.interfaces;
using Backend.DTOs;


namespace Backend.Services
{
    public class JwtServices(IConfiguration _configuration) : IJwtService
    {
        public string GenerateToken(LoginResponseDTO dto)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, dto.Email),
                    new Claim(ClaimTypes.Role, dto.Rol),
                    new Claim("Token", dto.Token ?? "")
                }),

                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],

                SigningCredentials = new SigningCredentials(

                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature

                )
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);

            // SecurityTokenDescriptor
        }


    }
}