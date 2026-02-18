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
    public class UserService : IService
    {
        private readonly IGenericRepository<User> _userRepository;

        public UserService(IGenericRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<string> RegisterAsync(RegisterRequestDto request)
        {


            try
            {
                var usuarios = await _userRepository.GetAllAsync();

                if (usuarios.Any(u => u.Email == request.Email))
                    throw new Exception("User already exists");

                var nuevoUsuario = new User
                {
                    Email = request.Email,
                    Password = request.Password,
                    RoleId = request.IdRol,
                    CreatedAt = DateTime.UtcNow
                };

                await _userRepository.AddAsync(nuevoUsuario);
                return "User registered successfully";

            }
            catch (Exception ex)
            {

                throw new Exception($"Error al registrar: {ex.Message}");
            }



        }

        public async Task<User> LoginAsync(LoginRequestDTO request)
        {


            try
            {

                var usuario = await _userRepository.GetAllAsync();

                var user = usuario.FirstOrDefault(u => u.Email == request.Email && u.Password == request.Password);

                if (user == null)
                    throw new Exception("Invalid credentials");

                return user;



            }
            catch (Exception ex)
            {

                throw new Exception($"Error al iniciar sesión: {ex.Message}");
            }
        }
    }
}
