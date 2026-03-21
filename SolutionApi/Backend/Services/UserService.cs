using Backend.DTOs;

using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Backend.interfaces;


namespace Backend.Services

{
    public class UserService(IGenericRepository<User> userRepository, IPasswordHasher<User> hasher) : IService
    {
        // private readonly IPasswordHasher _passwordHasher ;
        private readonly IGenericRepository<User> _userRepository = userRepository;


        public async Task<string> RegisterAsync(RegisterRequestDto request)
        {
            try
            {
                if (await _userRepository.ExistsAsync(request.Email))
                    throw new Exception("User already exists");

                var nuevoUsuario = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    RoleId = request.IdRol,
                    Active = true,
                    CreatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified)
                };

                nuevoUsuario.Password = hasher.HashPassword(nuevoUsuario, request.Password);

                await _userRepository.AddAsync(nuevoUsuario);
                return "User registered successfully";
            }
            catch (Exception ex)
            {
                // Log the full exception including inner exception
                var innerMessage = ex.InnerException?.Message ?? "No inner exception";
                throw new Exception($"Error al registrar: {ex.Message} | Inner: {innerMessage}");
            }
        }

        public async Task<User> LoginAsync(LoginRequestDTO request)
        {


            try
            {

                var usuario = await _userRepository.GetAllAsync();

                var user = usuario.FirstOrDefault(u => u.Email == request.Email);

                if (user == null)
                    throw new Exception("Usuario no encontrado");

                var result = hasher.VerifyHashedPassword(user, user.Password, request.Password);

                if (result != PasswordVerificationResult.Success)
                    throw new Exception("Contraseña incorrecta");


                if (result == PasswordVerificationResult.SuccessRehashNeeded)
                {
                    user.Password = hasher.HashPassword(user, request.Password);
                    await _userRepository.UpdateAsync(user);
                }
                return user;



            }
            catch (Exception ex)
            {

                throw new Exception($"Error al iniciar sesión: {ex.Message}");
            }
        }
    }
}
