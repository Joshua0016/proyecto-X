using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.interfaces;
using Backend.Models;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Services
{
    public class JwtServices(IConfiguration _configuration) : IJwtService
    {
        public string GenerateToken()
        {
            // Read JWT configuration
            var key = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var expireMinutes = int.Parse(_configuration["Jwt:ExpireMinutes"] ?? "60");

            // SecurityTokenDescriptor
        }

        public string GenerateToken(User user)
        {
            throw new NotImplementedException();
        }
    }
}