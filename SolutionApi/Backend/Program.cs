
using Backend.Data;
using Backend.Middleware;
using Backend.commons;
using Backend.Repositories;
using Backend.Models;
using Backend.Services;
using Backend.interfaces;
using Backend.DTOs;
using Microsoft.AspNetCore.Identity;
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

            // Registrar configuración de Mapster
            MapsterConfig.RegisterMappings();


            //registrar DbContext con PostgreSQL
            var connStr = builder.Configuration.GetConnectionString("DefaultConnection");
            var nt = new Npgsql.NameTranslation.NpgsqlNullNameTranslator();
            builder.Services.AddDbContext<DbProyectoXContext>(opts =>
                opts.UseNpgsql(connStr, o =>
                {
                    o.MapEnum<Gender>("genderenum", nameTranslator: nt);
                    o.MapEnum<MaritalStatus>("maritalstatusenum", nameTranslator: nt);
                    o.MapEnum<MemberType>("membertypeenum", nameTranslator: nt);
                    o.MapEnum<AcademicLevel>("academiclevelenum", nameTranslator: nt);
                    o.MapEnum<DonationStatus>("statusenum", nameTranslator: nt);
                    o.MapEnum<PaymentMethod>("paymentmethodenum", nameTranslator: nt);
                    o.MapEnum<UnitOfMeasure>("unitofmeasureenum", nameTranslator: nt);
                    o.MapEnum<CategoryItem>("categoryitemenum", nameTranslator: nt);
                    o.MapEnum<CaseStatus>("casestatusenum", nameTranslator: nt);
                    o.MapEnum<EventStatus>("eventstatusenum", nameTranslator: nt);
                    o.MapEnum<Municipio>("municipioenum", nameTranslator: nt);
                    o.MapEnum<Distrito>("distritoenum", nameTranslator: nt);
                    o.MapEnum<RelationShip>("relationshipenum", nameTranslator: nt);

                }));


            //registrar repositorios 
            builder.Services.AddScoped<IGenericRepository<User>, UserRepository>();

            //registrar servicio de autenticacion
            builder.Services.AddScoped<IService, UserService>();

            //registrar servicio JWT
            builder.Services.AddScoped<IJwtService, JwtServices>();

            builder.Services.AddScoped<IGenericRepository<Member>, MemberRepository>();

            builder.Services.AddScoped<IGenericRepository<Role>, RolesRepository>();
            builder.Services.AddScoped<IRole, RoleService>();

            builder.Services.AddScoped<IMemberService, MemberService>();

            builder.Services.AddScoped<AuditLogRepository>();
            builder.Services.AddScoped<IAuditLogService, AuditLogService>();

            builder.Services.AddScoped<DonationRepository>();
            builder.Services.AddScoped<IDonationService, DonationService>();

            builder.Services.AddScoped<FamilyRepository>();
            builder.Services.AddScoped<IFamilyService, FamilyService>();

            builder.Services.AddScoped<IGenericRepository<JournalEntry>, JournalEntryRepository>();
            builder.Services.AddScoped<JournalEntryRepository>();
            builder.Services.AddScoped<IJournalEntryService, JournalEntryService>();

            builder.Services.AddScoped<IGenericRepository<LedgerAccount>, LedgerAccountRepository>();
            builder.Services.AddScoped<LedgerAccountRepository>();
            builder.Services.AddScoped<ILedgerAccountService, LedgerAccountService>();

            builder.Services.AddScoped<IGenericRepository<LedgerTransaction>, LedgerTransactionRepository>();
            builder.Services.AddScoped<LedgerTransactionRepository>();
            builder.Services.AddScoped<ILedgerTransactionService, LedgerTransactionService>();

            builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

            builder.Services.AddScoped<IGenericRepository<Family>, FamilyRepository>();

            builder.Services.AddScoped<VendorRepository>();
            builder.Services.AddScoped<IVendorService, VendorService>();

            builder.Services.AddScoped<EventRepository>();
            builder.Services.AddScoped<IEventService, EventService>();

            builder.Services.AddScoped<AttendanceRepository>();
            builder.Services.AddScoped<IAttendanceService, AttendanceService>();

            builder.Services.AddScoped<TaxReceiptRepository>();
            builder.Services.AddScoped<ITaxReceiptService, TaxReceiptService>();

            builder.Services.AddScoped<ExpenseInvoiceRepository>();
            builder.Services.AddScoped<IExpenseInvoiceService, ExpenseInvoiceService>();







            //configurar autenticacion JWT
            var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
            var key = Encoding.UTF8.GetBytes(jwtKey);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero
                };
            });

            builder.Services.AddEndpointsApiExplorer();

            //agregar sericios para OpenAPI/Swagger
            builder.Services.AddSwaggerGen(c =>
            {

                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Backend API",
                    Version = "v1"
                });

                // Add JWT authentication to Swagger
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });

            });




            // servicio para mapear enums a a su valor string

            builder.Services.AddControllers()
                .AddJsonOptions(opts =>
                {
                    opts.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
                });


            var app = builder.Build();



            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseHttpsRedirection();

            //habilitar autenticacion y autorizacion
            app.UseAuthentication();

            app.UseAuthorization();

            app.UseMiddleware<AuditLogMiddleware>();

            app.MapControllers();

            app.Run();
        }
    }
}
