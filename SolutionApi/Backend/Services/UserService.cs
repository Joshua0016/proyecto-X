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
        private readonly IGenericRepository<usuario> _userRepository;

        public UserService(IGenericRepository<usuario> userRepository, IConfiguration config)
        {
            _userRepository = userRepository;
        }

        public async Task<string> RegisterAsync(RegisterRequestDto request)
        {
            // if (await _userRepository.ExistsAsync(request.Email))
            //     throw new Exception("User already exists");

            // var nuevoUsuario = new usuario
            // {
            //     email = request.Email,
            //     password = request.Password, // In production, hash the password!
            //     id_rol = request.IdRol, // Default role (e.g., user)
            //     fecha_creacion = DateTime.UtcNow
            // };

            // await _userRepository.AddAsync(nuevoUsuario);
            // return "User registered successfully";

            try
            {
                var usuarios = await _userRepository.GetAllAsync();

                if (usuarios.Any(u => u.email == request.Email))
                    throw new Exception("User already exists");

                var nuevoUsuario = new usuario
                {
                    email = request.Email,
                    password = request.Password,
                    id_rol = request.IdRol,
                    fecha_creacion = DateTime.UtcNow
                };

                await _userRepository.AddAsync(nuevoUsuario);
                return "User registered successfully";

            }
            catch (Exception ex)
            {

                throw new Exception($"Error al registrar: {ex.Message}");
            }



        }

        public async Task<usuario> LoginAsync(LoginRequestDTO request)
        {


            try
            {

                var usuario = await _userRepository.GetAllAsync();

                var user = usuario.FirstOrDefault(u => u.email == request.Email && u.password == request.Password);

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



