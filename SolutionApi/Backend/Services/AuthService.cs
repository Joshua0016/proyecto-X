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
using Backend.Models;


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

        public async Task<string> RegisterAsync(RegisterRequestDto request)
        {
            if (await _userRepository.ExistsAsync(request.Email))
                throw new Exception("User already exists");

            var nuevoUsuario = new usuario
            {
                email = request.Email,
                password = request.Password, // In production, hash the password!
                id_rol = request.IdRol, // Default role (e.g., user)
                fecha_creacion = DateTimeOffset.UtcNow
            };

            await _userRepository.AddAsync(nuevoUsuario);
            return "User registered successfully";



        }

        public async Task<LoginResponseDTO> LoginAsync(LoginRequestDTO request)
        {
            var usuario = await _userRepository.GetByEmailAsync(request.Email);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Password, usuario.password))
                throw new Exception("Invalid credentials");

            var token = GenerateJwtToken(usuario);



            return new LoginResponseDTO
            (
                token,
                usuario.email,
                usuario.id_rolNavigation.nombre // Return the token in the password field for simplicity
            );




        }

        public async Task<IEnumerable<UserResponseDTO>> GetUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(u => new UserResponseDTO(
                 u.id_usuario,
                 u.email,
                 u.id_rolNavigation.nombre,
                 u.fecha_creacion
            ));
        }

        private string GenerateJwtToken(usuario user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.id_usuario.ToString()),
                new Claim(ClaimTypes.Email, user.email),
                new Claim(ClaimTypes.Role, user.id_rolNavigation.nombre)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);


            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }
}



