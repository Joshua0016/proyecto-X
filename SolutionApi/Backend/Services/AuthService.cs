using Backend.DTOs;
using Backend.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;


namespace Backend.Services

{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _config;

        public AuthService(IUserRepository userRepository, IConfiguration config)
        {
            _userRepository = userRepository;
            _config = config;
        }

        public async Task<LoginResponseDTO?> AuthenticateAsync(LoginRequestDTO request)
        {
            if (request is null) return null;

            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user is null) return null;

            //verifica contraseña
            //remplaza por verficacion con hashing

            if (user.password != request.Password) return null;

            var jwtKey = _config["jwt:Key"];
            var jwtIssuer = _config["jwt:Issuer"];
            var jwtAudience = _config["jwt:Audience"];
            if (string.IsNullOrWhiteSpace(jwtKey)) return null;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.id_usuario.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.email),
                new Claim(ClaimTypes.NameIdentifier, user.id_usuario.ToString())
            };

            var roleName = user.id_rolNavigation?.nombre;
            if (!string.IsNullOrEmpty(roleName)) claims.Add(new Claim(ClaimTypes.Role, roleName));

            var expiresInMinutes = 60;
            if (int.TryParse(_config["jwt:ExpiresMinutes"], out var cfg)) expiresInMinutes = cfg;
            var expiresAt = DateTime.UtcNow.AddMinutes(expiresInMinutes);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return new LoginResponseDTO
            {
                Token = tokenString,
                ExpiresAt = expiresAt,
                Username = user.email,
                Roles = string.IsNullOrEmpty(roleName) ? Array.Empty<string>() : new[] { roleName }
            };


        }



    }
}
