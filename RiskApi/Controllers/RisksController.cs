using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RiskApi.Data;
using RiskApi.Helpers;
using RiskApi.Models;

namespace RiskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RisksController : ControllerBase
{
    private readonly RiskDbContext _db;
    public RisksController(RiskDbContext db) => _db = db;

    [HttpGet]
    public async Task<List<Risk>> Get() =>
        await _db.Risks.AsNoTracking().ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var risk = await _db.Risks.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return risk is null ? NotFound() : Ok(risk);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Risk risk)
    {
        risk.Score = RiskCalculator.Score(risk.Probability, risk.Impact);
        risk.Level = RiskCalculator.Level(risk.Score);

        if (risk.ResidualProbability.HasValue && risk.ResidualImpact.HasValue)
        {
            risk.ResidualScore = RiskCalculator.Score(risk.ResidualProbability.Value, risk.ResidualImpact.Value);
            risk.ResidualLevel = RiskCalculator.Level(risk.ResidualScore.Value);
        }

        _db.Risks.Add(risk);
        await _db.SaveChangesAsync();
        return Ok(risk);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Risk risk)
    {
        if (id != risk.Id) return BadRequest();

        risk.Score = RiskCalculator.Score(risk.Probability, risk.Impact);
        risk.Level = RiskCalculator.Level(risk.Score);

        if (risk.ResidualProbability.HasValue && risk.ResidualImpact.HasValue)
        {
            risk.ResidualScore = RiskCalculator.Score(risk.ResidualProbability.Value, risk.ResidualImpact.Value);
            risk.ResidualLevel = RiskCalculator.Level(risk.ResidualScore.Value);
        }
        else
        {
            risk.ResidualScore = null;
            risk.ResidualLevel = null;
        }

        _db.Entry(risk).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var risk = await _db.Risks.FindAsync(id);
        if (risk is null) return NotFound();
        _db.Risks.Remove(risk);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
