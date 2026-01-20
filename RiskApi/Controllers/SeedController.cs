using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RiskApi.Data;
using RiskApi.Helpers;
using RiskApi.Models;

namespace RiskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly RiskDbContext _db;
    public SeedController(RiskDbContext db) => _db = db;

    [HttpPost("demo")]
    public async Task<IActionResult> Demo([FromQuery] int risks = 30, [FromQuery] int days = 30)
    {
        risks = Math.Clamp(risks, 5, 200);
        days = Math.Clamp(days, 7, 365);

        // Si no hay assets, crea 3
        if (!await _db.Assets.AnyAsync())
        {
            _db.Assets.AddRange(
                new Asset { Name = "Servidor Web", Owner = "TI", Confidentiality = 4, Integrity = 4, Availability = 5, AssetValue = 4, Description = "Producción" },
                new Asset { Name = "Base de Datos", Owner = "TI", Confidentiality = 5, Integrity = 5, Availability = 4, AssetValue = 5, Description = "Datos críticos" },
                new Asset { Name = "App Móvil", Owner = "Producto", Confidentiality = 3, Integrity = 4, Availability = 4, AssetValue = 3, Description = "Canal digital" }
            );
            await _db.SaveChangesAsync();
        }

        var assetIds = await _db.Assets.Select(a => a.Id).ToListAsync();
        var rnd = new Random();

        string[] threats = { "Ransomware", "Phishing", "DDoS", "Data Leak", "Insider Threat", "Malware" };
        string[] vulns = { "Parches desactualizados", "MFA no habilitado", "Puertos expuestos", "Configuración insegura", "Backups débiles", "Roles excesivos" };
        string[] statuses = { "Pending", "InProgress", "Closed" };

        for (int i = 0; i < risks; i++)
        {
            int p = rnd.Next(1, 6);
            int imp = rnd.Next(1, 6);
            int score = RiskCalculator.Score(p, imp);
            string level = RiskCalculator.Level(score);

            var created = DateTime.UtcNow.Date.AddDays(-rnd.Next(0, days)).AddHours(rnd.Next(0, 23));

            _db.Risks.Add(new Risk
            {
                AssetId = assetIds[rnd.Next(assetIds.Count)],
                Threat = threats[rnd.Next(threats.Length)],
                Vulnerability = vulns[rnd.Next(vulns.Length)],
                ExistingControls = "Controles básicos",
                Probability = p,
                Impact = imp,
                Score = score,
                Level = level,
                Status = statuses[rnd.Next(statuses.Length)],
                Observations = "Registro demo",
                Recommendations = "Aplicar controles ISO",
                CreatedAt = created,
                UpdatedAt = created
            });
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Seed demo ok", risks, days });
    }
}
