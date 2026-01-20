using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RiskApi.Data;
using System.Text;

namespace RiskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly RiskDbContext _db;
    public ReportsController(RiskDbContext db) => _db = db;

    [HttpGet("risks.csv")]
    public async Task<IActionResult> RisksCsv()
    {
        var rows = await _db.Risks.AsNoTracking().ToListAsync();

        var sb = new StringBuilder();
        sb.AppendLine("Id,AssetId,Threat,Vulnerability,Probability,Impact,Score,Level,Status,ResidualScore,ResidualLevel,CreatedAt");

        foreach (var r in rows)
        {
            string esc(string? s) => "\"" + (s ?? "").Replace("\"", "\"\"") + "\"";
            sb.AppendLine(string.Join(",",
                r.Id,
                r.AssetId,
                esc(r.Threat),
                esc(r.Vulnerability),
                r.Probability,
                r.Impact,
                r.Score,
                r.Level,
                r.Status,
                r.ResidualScore?.ToString() ?? "",
                r.ResidualLevel ?? "",
                r.CreatedAt.ToString("yyyy-MM-dd")
            ));
        }

        var bytes = Encoding.UTF8.GetBytes(sb.ToString());
        return File(bytes, "text/csv", "risk-report.csv");
    }
}
