
using Backend.Data;
using Backend.Repositories;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

namespace Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);


            //registrar DbContext con PostgreSQL
            builder.Services.AddDbContext<Backend.Data.ApplicationDbContext>(opts =>
                opts.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


            //registrar repositorios 
            builder.Services.AddScoped<IGenericRepository<usuario>, UserRepository>();

            //registrar servicio de autenticacion
            builder.Services.AddScoped<IService, UserService>();


            builder.Services.AddScoped<IGenericRepository<Miembro>, MemberRepository>();

            builder.Services.AddScoped<IGenericRepository<rol>, rolesRepository>();


            //configurar autenticacion JWT
            var jwtKey = builder.Configuration["jwt:Key"] ?? string.Empty;
            var key = Encoding.UTF8.GetBytes(jwtKey);

            // builder.Services.AddAuthentication(options =>
            // {
            //     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            //     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            // }).AddJwtBearer(options =>
            // {
            //     options.TokenValidationParameters = new TokenValidationParameters
            //     {
            //         ValidateIssuer = true,
            //         ValidateAudience = true,
            //         ValidateIssuerSigningKey = true,
            //         ValidIssuer = builder.Configuration["jwt:Issuer"],
            //         ValidAudience = builder.Configuration["jwt:Audience"],
            //         IssuerSigningKey = new SymmetricSecurityKey(key)
            //     };
            // });

            builder.Services.AddEndpointsApiExplorer();

            //agregar sericios para OpenAPI/Swagger
            builder.Services.AddSwaggerGen(c =>
            {

                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Backend API",
                    Version = "v1"
                });

            });




            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            //{
            //    app.MapOpenApi();
            //}

            //if (app.Environment.IsDevelopment())
            //{
            //    app.UseSwagger();
            //    app.UseSwaggerUI(c =>
            //    {
            //        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Backend API v1");
            //    });
            //}

            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseHttpsRedirection();

            //habilitar autenticacion y autorizacion
            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
