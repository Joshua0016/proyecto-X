using System.Security.Claims;
using Backend.interfaces;
using Backend.Models;

namespace Backend.Middleware;

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

        var userId = GetUserId(context);
        if (userId == 0)
        {
            _logger.LogWarning("AuditLogMiddleware: skipping audit log for {Method} {Path} — no authenticated user", method, path);
            return;
        }

        var entry = new AuditLog
        {
            Timestamp = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified),
            UserId = userId,
            Operation = GetOperation(method),
            AffectedTable = GetAffectedTable(path),
            NewValues = body,
            OldValues = null,
            EntityId = null,
            HttpMethod = method,
            Endpoint = path,
            SourceIp = GetSourceIp(context),
            Detail = null
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
        "POST" => "CREATE",
        "PUT" => "UPDATE",
        "PATCH" => "UPDATE",
        "DELETE" => "DELETE",
        _ => "UNKNOWN"
    };

    private static string GetAffectedTable(string path)
    {
        // path.Split('/') for "/api/Member/Create" → ["", "api", "Member", "Create"]
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
