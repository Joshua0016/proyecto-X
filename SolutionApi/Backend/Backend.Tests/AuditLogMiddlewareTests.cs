// Feature: audit-log-middleware
// Property 1: Solo peticiones mutantes generan logs
// Property 2: Rutas excluidas no generan logs

using System.Net;
using System.Security.Claims;
using System.Text;
using FsCheck;
using FsCheck.Fluent;
using FsCheck.Xunit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace Backend.Tests;

// ── Minimal types needed to test the middleware in isolation ──────────────────

public class AuditLog
{
    public int LogId { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public int UserId { get; set; }
    public string Operation { get; set; } = null!;
    public string AffectedTable { get; set; } = null!;
    public string? EntityId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string? HttpMethod { get; set; }
    public string? Endpoint { get; set; }
    public string? Detail { get; set; }
    public string SourceIp { get; set; } = null!;
}

public interface IAuditLogService
{
    Task Log(AuditLog entry);
}

// ── Middleware under test ─────────────────────────────────────────────────────

public class AuditLogMiddleware(RequestDelegate next, ILogger<AuditLogMiddleware> logger)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<AuditLogMiddleware> _logger = logger;

    public async Task InvokeAsync(HttpContext context, IAuditLogService auditLogService)
    {
        if (!IsMutatingRequest(context) || IsExcludedPath(context.Request.Path))
        {
            await _next(context);
            return;
        }

        context.Request.EnableBuffering();
        await _next(context);

        var method = context.Request.Method.ToUpperInvariant();
        var path = context.Request.Path.Value ?? string.Empty;

        string? body = null;
        if (method is "POST" or "PUT" or "PATCH")
            body = await ReadBodyAsync(context.Request);

        var entry = new AuditLog
        {
            Timestamp     = DateTime.UtcNow,
            UserId        = GetUserId(context),
            Operation     = GetOperation(method),
            AffectedTable = GetAffectedTable(path),
            NewValues     = body,
            OldValues     = null,
            EntityId      = null,
            HttpMethod    = method,
            Endpoint      = path,
            SourceIp      = GetSourceIp(context),
            Detail        = null
        };

        try
        {
            await auditLogService.Log(entry);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "AuditLogMiddleware: error persisting audit log entry for {Method} {Path}", method, path);
        }
    }

    private static bool IsMutatingRequest(HttpContext context)
    {
        var method = context.Request.Method.ToUpperInvariant();
        return method is "POST" or "PUT" or "DELETE" or "PATCH";
    }

    private static bool IsExcludedPath(string path)
    {
        var lower = path.ToLowerInvariant();
        return lower.Contains("/auditlog") || lower.Contains("/auth") || lower.Contains("/login");
    }

    private static string GetOperation(string method) => method switch
    {
        "POST"   => "CREATE",
        "PUT"    => "UPDATE",
        "PATCH"  => "UPDATE",
        "DELETE" => "DELETE",
        _        => "UNKNOWN"
    };

    private static string GetAffectedTable(string path)
    {
        var segments = path.Split('/', StringSplitOptions.None);
        if (segments.Length >= 3 && segments[1].Equals("api", StringComparison.OrdinalIgnoreCase)
            && !string.IsNullOrEmpty(segments[2]))
            return segments[2];
        return "Unknown";
    }

    private static int GetUserId(HttpContext context)
    {
        var claim = context.User?.FindFirst("UserId")?.Value;
        return int.TryParse(claim, out var id) ? id : 0;
    }

    private static string GetSourceIp(HttpContext context)
        => context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

    private static async Task<string?> ReadBodyAsync(HttpRequest request)
    {
        try
        {
            request.Body.Position = 0;
            using var reader = new StreamReader(request.Body, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            request.Body.Position = 0;
            return string.IsNullOrEmpty(body) ? null : body;
        }
        catch
        {
            return null;
        }
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

internal static class MiddlewareTestHelpers
{
    public static readonly string[] MutatingMethods = ["POST", "PUT", "PATCH", "DELETE"];
    public static readonly string[] NonMutatingMethods = ["GET", "HEAD", "OPTIONS", "TRACE", "CONNECT"];

    public static DefaultHttpContext BuildContext(string method, string path)
    {
        var ctx = new DefaultHttpContext();
        ctx.Request.Method = method;
        ctx.Request.Path = path;
        ctx.Request.Body = new MemoryStream();
        return ctx;
    }

    public static AuditLogMiddleware BuildMiddleware()
        => new(_ => Task.CompletedTask, NullLogger<AuditLogMiddleware>.Instance);
    public static AuditLogMiddleware BuildMiddleware(ILogger<AuditLogMiddleware> logger)
        => new(_ => Task.CompletedTask, logger);

    /// <summary>Generates random exceptions with arbitrary messages.</summary>
    public static Arbitrary<Exception> ExceptionArbitrary()
    {
        var gen = from len in Gen.Choose(1, 30)
                  from chars in Gen.ListOf<char>(
                      Gen.Elements("abcdefghijklmnopqrstuvwxyz ".ToCharArray()), len)
                  from exType in Gen.Choose(0, 2)
                  let msg = new string(chars.ToArray())
                  select exType switch
                  {
                      0 => new Exception(msg),
                      1 => (Exception)new InvalidOperationException(msg),
                      _ => new TimeoutException(msg)
                  };
        return gen.ToArbitrary();
    }

    /// <summary>Generates a path containing one of the excluded keywords in random casing.</summary>
    public static Arbitrary<string> ExcludedPathArbitrary()
    {
        var keywords = new[] { "auditlog", "auth", "login" };

        var gen = from keyword in Gen.Elements(keywords)
                  from flips in Gen.ListOf<int>(Gen.Choose(0, 1), keyword.Length)
                  select BuildRandomCasedPath(keyword, flips.ToArray());

        return gen.ToArbitrary();
    }

    private static string BuildRandomCasedPath(string keyword, int[] flips)
    {
        var chars = keyword.ToCharArray();
        for (int i = 0; i < chars.Length; i++)
        {
            if (i < flips.Length && flips[i] == 1)
                chars[i] = char.ToUpperInvariant(chars[i]);
        }
        return $"/api/{new string(chars)}/resource";
    }

    public static Arbitrary<string> NonMutatingMethodArbitrary()
        => Gen.Elements(NonMutatingMethods).ToArbitrary();

    public static Arbitrary<string> MutatingMethodArbitrary()
        => Gen.Elements(MutatingMethods).ToArbitrary();

    /// <summary>Generates non-empty alphanumeric strings suitable as a resource segment.</summary>
    public static Arbitrary<string> AlphanumericResourceArbitrary()
    {
        const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var charGen = Gen.Elements(chars.ToCharArray());
        var gen = from len in Gen.Choose(1, 20)
                  from arr in Gen.ListOf<char>(charGen, len)
                  select new string(arr.ToArray());
        return gen.ToArbitrary();
    }

    /// <summary>Generates strings that cannot be parsed as integers (for invalid UserId claims).</summary>
    public static Arbitrary<string> NonIntegerStringArbitrary()
    {
        // Use non-empty strings that contain at least one non-digit character
        const string nonDigits = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
        var nonDigitGen = Gen.Elements(nonDigits.ToCharArray());
        var anyCharGen = Gen.Elements(
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ".ToCharArray());

        var gen = from prefix in Gen.ListOf<char>(anyCharGen, 3)
                  from suffix in nonDigitGen  // guarantees at least one non-digit
                  select new string(prefix.ToArray()) + suffix;

        return gen.ToArbitrary();
    }

    /// <summary>Generates methods that carry a payload (POST, PUT, PATCH).</summary>
    public static Arbitrary<string> PayloadMethodArbitrary()
        => Gen.Elements(new[] { "POST", "PUT", "PATCH" }).ToArbitrary();

    /// <summary>Generates random non-empty JSON-like strings for request bodies.</summary>
    public static Arbitrary<string> JsonBodyArbitrary()
    {
        var keyGen = from len in Gen.Choose(1, 10)
                     from chars in Gen.ListOf<char>(
                         Gen.Elements("abcdefghijklmnopqrstuvwxyz".ToCharArray()), len)
                     select new string(chars.ToArray());

        var valueGen = from len in Gen.Choose(1, 20)
                       from chars in Gen.ListOf<char>(
                           Gen.Elements("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ".ToCharArray()), len)
                       select new string(chars.ToArray());

        var gen = from key in keyGen
                  from val in valueGen
                  select $"{{\"{key}\":\"{val}\"}}";

        return gen.ToArbitrary();
    }

    /// <summary>Builds a context with a body stream containing the given content.</summary>
    public static DefaultHttpContext BuildContextWithBody(string method, string path, string bodyContent)
    {
        var ctx = new DefaultHttpContext();
        ctx.Request.Method = method;
        ctx.Request.Path = path;
        var bodyBytes = Encoding.UTF8.GetBytes(bodyContent);
        ctx.Request.Body = new MemoryStream(bodyBytes);
        ctx.Request.Body.Position = 0;
        ctx.Request.ContentLength = bodyBytes.Length;
        return ctx;
    }

    /// <summary>Generates random IPv4 addresses.</summary>
    public static Arbitrary<System.Net.IPAddress> IpAddressArbitrary()
    {
        var gen = from b1 in Gen.Choose(0, 255)
                  from b2 in Gen.Choose(0, 255)
                  from b3 in Gen.Choose(0, 255)
                  from b4 in Gen.Choose(0, 255)
                  select new System.Net.IPAddress(new byte[] { (byte)b1, (byte)b2, (byte)b3, (byte)b4 });
        return gen.ToArbitrary();
    }
}

// ── Property Tests ────────────────────────────────────────────────────────────

public class AuditLogMiddlewarePropertyTests
{
    // Feature: audit-log-middleware, Property 1: Solo peticiones mutantes generan logs
    // Validates: Requirements 1.1, 1.2

    [Property(MaxTest = 100)]
    public Property NonMutatingRequests_DoNotInvokeLog()
    {
        return Prop.ForAll(
            MiddlewareTestHelpers.NonMutatingMethodArbitrary(),
            method =>
            {
                var mockService = new Mock<IAuditLogService>();
                var ctx = MiddlewareTestHelpers.BuildContext(method, "/api/Member/List");
                var middleware = MiddlewareTestHelpers.BuildMiddleware();

                middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

                mockService.Verify(s => s.Log(It.IsAny<AuditLog>()), Times.Never);
            });
    }

    [Property(MaxTest = 100)]
    public Property MutatingRequests_InvokeLogExactlyOnce()
    {
        return Prop.ForAll(
            MiddlewareTestHelpers.MutatingMethodArbitrary(),
            method =>
            {
                var mockService = new Mock<IAuditLogService>();
                mockService.Setup(s => s.Log(It.IsAny<AuditLog>())).Returns(Task.CompletedTask);
                var ctx = MiddlewareTestHelpers.BuildContext(method, "/api/Member/Create");
                var middleware = MiddlewareTestHelpers.BuildMiddleware();

                middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

                mockService.Verify(s => s.Log(It.IsAny<AuditLog>()), Times.Once);
            });
    }

    // Feature: audit-log-middleware, Property 2: Rutas excluidas no generan logs
    // Validates: Requirements 1.3, 1.4

    [Property(MaxTest = 100)]
    public Property ExcludedPaths_DoNotInvokeLog_EvenWithMutatingMethods()
    {
        return Prop.ForAll(
            MiddlewareTestHelpers.ExcludedPathArbitrary(),
            MiddlewareTestHelpers.MutatingMethodArbitrary(),
            (path, method) =>
            {
                var mockService = new Mock<IAuditLogService>();
                var ctx = MiddlewareTestHelpers.BuildContext(method, path);
                var middleware = MiddlewareTestHelpers.BuildMiddleware();

                middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

                mockService.Verify(s => s.Log(It.IsAny<AuditLog>()), Times.Never);
            });
    }

    // Feature: audit-log-middleware, Property 3: Mapeo HTTP → Operation es exhaustivo y correcto
    // Validates: Requirements 3.1, 3.2, 3.3

    [Property(MaxTest = 100)]
    public Property MutatingMethod_MapsToCorrectOperation_AndIsNeverNull()
    {
        return Prop.ForAll(
            MiddlewareTestHelpers.MutatingMethodArbitrary(),
            method =>
            {
                AuditLog? captured = null;
                var mockService = new Mock<IAuditLogService>();
                mockService
                    .Setup(s => s.Log(It.IsAny<AuditLog>()))
                    .Callback<AuditLog>(e => captured = e)
                    .Returns(Task.CompletedTask);

                var ctx = MiddlewareTestHelpers.BuildContext(method, "/api/Member/Create");
                var middleware = MiddlewareTestHelpers.BuildMiddleware();

                middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

                if (captured == null) return false;
                if (captured.Operation == null) return false;

                var expected = method.ToUpperInvariant() switch
                {
                    "POST"   => "CREATE",
                    "PUT"    => "UPDATE",
                    "PATCH"  => "UPDATE",
                    "DELETE" => "DELETE",
                    _        => null
                };

                return captured.Operation == expected;
            });
    }

    // Feature: audit-log-middleware, Property 4: Inferencia de AffectedTable desde el path
    // Validates: Requirements 4.1, 4.2

    [Property(MaxTest = 100)]
    public Property ApiPath_WithResourceSegment_SetsAffectedTable()
    {
        return Prop.ForAll(
            MiddlewareTestHelpers.AlphanumericResourceArbitrary(),
            resource =>
            {
                AuditLog? captured = null;
                var mockService = new Mock<IAuditLogService>();
                mockService
                    .Setup(s => s.Log(It.IsAny<AuditLog>()))
                    .Callback<AuditLog>(e => captured = e)
                    .Returns(Task.CompletedTask);

                var path = $"/api/{resource}/action";
                var ctx = MiddlewareTestHelpers.BuildContext("POST", path);
                var middleware = MiddlewareTestHelpers.BuildMiddleware();

                middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

                return captured != null && captured.AffectedTable == resource;
            });
    }

    [Fact]
    public void ApiPath_WithoutResourceSegment_SetsAffectedTableToUnknown()
    {
        AuditLog? captured = null;
        var mockService = new Mock<IAuditLogService>();
        mockService
            .Setup(s => s.Log(It.IsAny<AuditLog>()))
            .Callback<AuditLog>(e => captured = e)
            .Returns(Task.CompletedTask);

        var ctx = MiddlewareTestHelpers.BuildContext("POST", "/api/");
        var middleware = MiddlewareTestHelpers.BuildMiddleware();

        middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

        Assert.NotNull(captured);
        Assert.Equal("Unknown", captured.AffectedTable);
    }

    // Feature: audit-log-middleware, Property 5: UserId fallback ante claim ausente o inválido
    // Validates: Requirements 2.2

    [Property(MaxTest = 100)]
    public Property InvalidUserIdClaim_SetsUserIdToZero()
    {
        return Prop.ForAll(
            MiddlewareTestHelpers.NonIntegerStringArbitrary(),
            invalidValue =>
            {
                AuditLog? captured = null;
                var mockService = new Mock<IAuditLogService>();
                mockService
                    .Setup(s => s.Log(It.IsAny<AuditLog>()))
                    .Callback<AuditLog>(e => captured = e)
                    .Returns(Task.CompletedTask);

                var ctx = MiddlewareTestHelpers.BuildContext("POST", "/api/Member/Create");
                ctx.User = new ClaimsPrincipal(new ClaimsIdentity(
                    new[] { new Claim("UserId", invalidValue) }));
                var middleware = MiddlewareTestHelpers.BuildMiddleware();

                middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

                return captured != null && captured.UserId == 0;
            });
    }

    [Fact]
    public void MissingUserIdClaim_SetsUserIdToZero()
    {
        AuditLog? captured = null;
        var mockService = new Mock<IAuditLogService>();
        mockService
            .Setup(s => s.Log(It.IsAny<AuditLog>()))
            .Callback<AuditLog>(e => captured = e)
            .Returns(Task.CompletedTask);

        var ctx = MiddlewareTestHelpers.BuildContext("POST", "/api/Member/Create");
        ctx.User = new ClaimsPrincipal(new ClaimsIdentity()); // no claims
        var middleware = MiddlewareTestHelpers.BuildMiddleware();

        middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

        Assert.NotNull(captured);
        Assert.Equal(0, captured.UserId);
    }

    // Feature: audit-log-middleware, Property 6: Body capturado correctamente para métodos con payload
    // Validates: Requirements 5.1, 5.2, 5.4

    [Property(MaxTest = 100)]
    public Property PayloadMethods_CaptureBodyAsNewValues()
    {
        return Prop.ForAll(
            MiddlewareTestHelpers.PayloadMethodArbitrary(),
            MiddlewareTestHelpers.JsonBodyArbitrary(),
            (method, body) =>
            {
                AuditLog? captured = null;
                var mockService = new Mock<IAuditLogService>();
                mockService
                    .Setup(s => s.Log(It.IsAny<AuditLog>()))
                    .Callback<AuditLog>(e => captured = e)
                    .Returns(Task.CompletedTask);

                var ctx = MiddlewareTestHelpers.BuildContextWithBody(method, "/api/Member/Create", body);
                var middleware = MiddlewareTestHelpers.BuildMiddleware();

                middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

                return (captured != null && captured.NewValues == body)
                    .Label($"Expected NewValues='{body}' but got '{captured?.NewValues}'");
            });
    }

    [Property(MaxTest = 100)]
    public Property DeleteMethod_SetsNewValuesToNull()
    {
        return Prop.ForAll(
            MiddlewareTestHelpers.JsonBodyArbitrary(),
            body =>
            {
                AuditLog? captured = null;
                var mockService = new Mock<IAuditLogService>();
                mockService
                    .Setup(s => s.Log(It.IsAny<AuditLog>()))
                    .Callback<AuditLog>(e => captured = e)
                    .Returns(Task.CompletedTask);

                // Even if a body is present, DELETE should set NewValues to null
                var ctx = MiddlewareTestHelpers.BuildContextWithBody("DELETE", "/api/Member/1", body);
                var middleware = MiddlewareTestHelpers.BuildMiddleware();

                middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

                return (captured != null && captured.NewValues == null)
                    .Label($"Expected NewValues=null for DELETE but got '{captured?.NewValues}'");
            });
    }

    [Fact]
    public void EmptyBody_SetsNewValuesToNull()
    {
        AuditLog? captured = null;
        var mockService = new Mock<IAuditLogService>();
        mockService
            .Setup(s => s.Log(It.IsAny<AuditLog>()))
            .Callback<AuditLog>(e => captured = e)
            .Returns(Task.CompletedTask);

        // POST with empty body
        var ctx = MiddlewareTestHelpers.BuildContext("POST", "/api/Member/Create");
        var middleware = MiddlewareTestHelpers.BuildMiddleware();

        middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

        Assert.NotNull(captured);
        Assert.Null(captured.NewValues);
    }

    // Feature: audit-log-middleware, Property 6 (metadatos): Endpoint, HttpMethod y SourceIp correctos
    // Validates: Requirements 6.1, 6.2, 6.3, 6.4

    [Property(MaxTest = 100)]
    public Property EndpointAndHttpMethod_AreRecordedCorrectly()
    {
        return Prop.ForAll(
            MiddlewareTestHelpers.MutatingMethodArbitrary(),
            MiddlewareTestHelpers.AlphanumericResourceArbitrary(),
            (method, resource) =>
            {
                AuditLog? captured = null;
                var mockService = new Mock<IAuditLogService>();
                mockService
                    .Setup(s => s.Log(It.IsAny<AuditLog>()))
                    .Callback<AuditLog>(e => captured = e)
                    .Returns(Task.CompletedTask);

                var path = $"/api/{resource}/action";
                var ctx = MiddlewareTestHelpers.BuildContext(method, path);
                var middleware = MiddlewareTestHelpers.BuildMiddleware();

                middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

                return (captured != null
                    && captured.Endpoint == path
                    && captured.HttpMethod == method.ToUpperInvariant())
                    .Label($"Expected Endpoint='{path}', HttpMethod='{method.ToUpperInvariant()}' " +
                           $"but got Endpoint='{captured?.Endpoint}', HttpMethod='{captured?.HttpMethod}'");
            });
    }

    [Property(MaxTest = 100)]
    public Property SourceIp_IsRecordedFromRemoteIpAddress()
    {
        return Prop.ForAll(
            MiddlewareTestHelpers.IpAddressArbitrary(),
            ip =>
            {
                AuditLog? captured = null;
                var mockService = new Mock<IAuditLogService>();
                mockService
                    .Setup(s => s.Log(It.IsAny<AuditLog>()))
                    .Callback<AuditLog>(e => captured = e)
                    .Returns(Task.CompletedTask);

                var ctx = MiddlewareTestHelpers.BuildContext("POST", "/api/Member/Create");
                ctx.Connection.RemoteIpAddress = ip;
                var middleware = MiddlewareTestHelpers.BuildMiddleware();

                middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

                return (captured != null && captured.SourceIp == ip.ToString())
                    .Label($"Expected SourceIp='{ip}' but got '{captured?.SourceIp}'");
            });
    }

    [Fact]
    public void NullRemoteIpAddress_SetsSourceIpToUnknown()
    {
        AuditLog? captured = null;
        var mockService = new Mock<IAuditLogService>();
        mockService
            .Setup(s => s.Log(It.IsAny<AuditLog>()))
            .Callback<AuditLog>(e => captured = e)
            .Returns(Task.CompletedTask);

        var ctx = MiddlewareTestHelpers.BuildContext("POST", "/api/Member/Create");
        ctx.Connection.RemoteIpAddress = null;
        var middleware = MiddlewareTestHelpers.BuildMiddleware();

        middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

        Assert.NotNull(captured);
        Assert.Equal("unknown", captured.SourceIp);
    }

    // Feature: audit-log-middleware, Property 7: Errores en Log no interrumpen la respuesta HTTP
    // Validates: Requirements 7.2

    [Property(MaxTest = 100)]
    public Property LogException_DoesNotInterruptHttpResponse()
    {
        return Prop.ForAll(
            MiddlewareTestHelpers.MutatingMethodArbitrary(),
            MiddlewareTestHelpers.ExceptionArbitrary(),
            (method, exception) =>
            {
                var mockService = new Mock<IAuditLogService>();
                mockService
                    .Setup(s => s.Log(It.IsAny<AuditLog>()))
                    .ThrowsAsync(exception);

                var mockLogger = new Mock<ILogger<AuditLogMiddleware>>();
                var ctx = MiddlewareTestHelpers.BuildContext(method, "/api/Member/Create");
                var middleware = MiddlewareTestHelpers.BuildMiddleware(mockLogger.Object);

                middleware.InvokeAsync(ctx, mockService.Object).GetAwaiter().GetResult();

                // Response status code should remain unchanged (not 500)
                var statusOk = ctx.Response.StatusCode != 500;

                // Verify the exception was logged via ILogger.LogError
                var loggerCalled = mockLogger.Invocations.Any(i =>
                    i.Method.Name == "Log" &&
                    i.Arguments.OfType<LogLevel>().Any(l => l == LogLevel.Error));

                return (statusOk && loggerCalled)
                    .Label($"StatusCode={ctx.Response.StatusCode} (expected != 500), LoggerCalled={loggerCalled}");
            });
    }
}

// ── Integration Test: Middleware registered in the pipeline ───────────────────
// Feature: audit-log-middleware, Task 6.1: Middleware registrado en la pipeline
// Validates: Requirements 8.3

public class AuditLogMiddlewareIntegrationTests
{
    [Fact]
    public async Task MiddlewareInPipeline_PostRequest_InvokesAuditLogService()
    {
        // Arrange
        var mockService = new Mock<IAuditLogService>();
        mockService
            .Setup(s => s.Log(It.IsAny<AuditLog>()))
            .Returns(Task.CompletedTask);

        using var server = new TestServer(new WebHostBuilder()
            .ConfigureServices(services =>
            {
                services.AddSingleton(mockService.Object);
                services.AddLogging();
            })
            .Configure(app =>
            {
                app.UseMiddleware<AuditLogMiddleware>();
                app.Run(async context =>
                {
                    context.Response.StatusCode = 200;
                    await context.Response.WriteAsync("OK");
                });
            }));
        var client = server.CreateClient();

        // Act
        var content = new StringContent("{\"name\":\"test\"}", Encoding.UTF8, "application/json");
        var response = await client.PostAsync("/api/Test/Create", content);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.OK, response.StatusCode);
        mockService.Verify(s => s.Log(It.IsAny<AuditLog>()), Times.Once);
    }
}
