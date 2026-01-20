using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RiskApi.Data;

namespace RiskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly RiskDbContext _db;
    public DashboardController(RiskDbContext db) => _db = db;

    // ✅ KPIs + distribución
    [HttpGet("summary")]
    public async Task<IActionResult> Summary()
    {
        var total = await _db.Risks.CountAsync();

        var byLevel = await _db.Risks
            .GroupBy(r => r.Level)
            .Select(g => new { level = g.Key, count = g.Count() })
            .ToListAsync();

        var byStatus = await _db.Risks
            .GroupBy(r => r.Status)
            .Select(g => new { status = g.Key, count = g.Count() })
            .ToListAsync();

        // ✅ Seguimiento de controles implementados (monitoreo)
        var controlsTotal = await _db.TreatmentControls.CountAsync();
        var controlsImplemented = await _db.TreatmentControls.CountAsync(c => c.Status == "Implemented");

        return Ok(new
        {
            total,
            byLevel,
            byStatus,
            controlsTotal,
            controlsImplemented
        });
    }

    // ✅ Trend real (últimos N días)
    // Devuelve: date, count, high, critical, scoreSum
    [HttpGet("trend")]
    public async Task<IActionResult> Trend([FromQuery] int days = 14)
    {
        if (days < 7) days = 7;
        if (days > 90) days = 90;

        var end = DateTime.UtcNow.Date;
        var start = end.AddDays(-(days - 1));

        var raw = await _db.Risks
            .Where(r => r.CreatedAt >= start && r.CreatedAt < end.AddDays(1))
            .GroupBy(r => r.CreatedAt.Date)
            .Select(g => new
            {
                date = g.Key,
                count = g.Count(),
                high = g.Count(x => x.Level == "High"),
                critical = g.Count(x => x.Level == "Critical"),
                scoreSum = g.Sum(x => x.Score)
            })
            .ToListAsync();

        // Rellenar días faltantes con 0 (para que el chart sea continuo)
        var map = raw.ToDictionary(x => x.date, x => x);
        var result = new List<object>();

        for (var d = start; d <= end; d = d.AddDays(1))
        {
            if (map.TryGetValue(d, out var v))
            {
                result.Add(new
                {
                    date = d.ToString("yyyy-MM-dd"),
                    count = v.count,
                    high = v.high,
                    critical = v.critical,
                    scoreSum = v.scoreSum
                });
            }
            else
            {
                result.Add(new
                {
                    date = d.ToString("yyyy-MM-dd"),
                    count = 0,
                    high = 0,
                    critical = 0,
                    scoreSum = 0
                });
            }
        }

        return Ok(result);
    }
}
