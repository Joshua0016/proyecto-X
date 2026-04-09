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
        // Req 1.1 / 1.2 / 1.3 / 1.4: only intercept mutating, non-excluded requests
        if (!IsMutatingRequest(context) || IsExcludedPath(context.Request.Path))
        {
            await _next(context);
            return;
        }

        // Req 5.3: enable buffering so the controller can also read the body
        context.Request.EnableBuffering();

        // Req 7.1: let the controller process the request first
        await _next(context);

        var method = context.Request.Method.ToUpperInvariant();
        var path = context.Request.Path.Value ?? string.Empty;

        // Req 5.1 / 5.2: read body for POST/PUT/PATCH; null for DELETE
        string? body = null;
        if (method is "POST" or "PUT" or "PATCH")
            body = await ReadBodyAsync(context.Request);

        var entry = new AuditLog
        {
            Timestamp     = DateTime.UtcNow,                  // Req 6.5
            UserId        = GetUserId(context),               // Req 2.1 / 2.2
            Operation     = GetOperation(method),             // Req 3.1 / 3.2 / 3.3
            AffectedTable = GetAffectedTable(path),           // Req 4.1 / 4.2
            NewValues     = body,                             // Req 5.1 / 5.2
            OldValues     = null,
            EntityId      = null,
            HttpMethod    = method,                           // Req 6.2
            Endpoint      = path,                             // Req 6.1
            SourceIp      = GetSourceIp(context),            // Req 6.3 / 6.4
            Detail        = null
        };

        // Req 7.2: catch exceptions from Log without interrupting the HTTP response
        try
        {
            await auditLogService.Log(entry);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "AuditLogMiddleware: error persisting audit log entry for {Method} {Path}", method, path);
        }
    }

    // Req 1.1 / 1.2
    private static bool IsMutatingRequest(HttpContext context)
    {
        var method = context.Request.Method.ToUpperInvariant();
        return method is "POST" or "PUT" or "DELETE" or "PATCH";
    }

    // Req 1.3 / 1.4
    private static bool IsExcludedPath(string path)
    {
        var lower = path.ToLowerInvariant();
        return lower.Contains("/auditlog") || lower.Contains("/auth") || lower.Contains("/login");
    }

    // Req 3.1 / 3.2 / 3.3
    private static string GetOperation(string method) => method switch
    {
        "POST"   => "CREATE",
        "PUT"    => "UPDATE",
        "PATCH"  => "UPDATE",
        "DELETE" => "DELETE",
        _        => "UNKNOWN"
    };

    // Req 4.1 / 4.2
    private static string GetAffectedTable(string path)
    {
        // path.Split('/') for "/api/Member/Create" → ["", "api", "Member", "Create"]
        var segments = path.Split('/', StringSplitOptions.None);
        if (segments.Length >= 3 && segments[1].Equals("api", StringComparison.OrdinalIgnoreCase)
            && !string.IsNullOrEmpty(segments[2]))
            return segments[2];

        return "Unknown";
    }

    // Req 2.1 / 2.2
    private static int GetUserId(HttpContext context)
    {
        var claim = context.User?.FindFirst("UserId")?.Value;
        return int.TryParse(claim, out var id) ? id : 0;
    }

    // Req 6.3 / 6.4
    private static string GetSourceIp(HttpContext context)
        => context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

    // Req 5.1 / 5.3 / 5.4
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
