using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RiskApi.Data;
using RiskApi.Models;

namespace RiskApi.Controllers;

public record TreatmentUpsertDto(
    int RiskId,
    string Strategy,
    string Owner,
    DateTime? DueDate,
    string? Notes,
    int? ResidualProbability,
    int? ResidualImpact,
    List<ControlPickDto> Controls
);

public record ControlPickDto(
    int Control27002Id,
    string Status,
    string? Evidence
);

[ApiController]
[Route("api/[controller]")]
public class TreatmentPlansController : ControllerBase
{
    private readonly RiskDbContext _db;
    public TreatmentPlansController(RiskDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _db.TreatmentPlans
            .AsNoTracking()
            .Include(t => t.TreatmentControls)
            .ThenInclude(tc => tc.Control)
            .ToListAsync();

        return Ok(items);
    }

    [HttpGet("by-risk/{riskId:int}")]
    public async Task<IActionResult> GetByRisk(int riskId)
    {
        var plan = await _db.TreatmentPlans
            .AsNoTracking()
            .Include(t => t.TreatmentControls)
            .ThenInclude(tc => tc.Control)
            .FirstOrDefaultAsync(t => t.RiskId == riskId);

        return plan is null ? NotFound() : Ok(plan);
    }

    [HttpPost]
    public async Task<IActionResult> Upsert(TreatmentUpsertDto dto)
    {
        var risk = await _db.Risks.FirstOrDefaultAsync(r => r.Id == dto.RiskId);
        if (risk is null) return NotFound("Risk not found");

        var plan = await _db.TreatmentPlans
            .Include(t => t.TreatmentControls)
            .FirstOrDefaultAsync(t => t.RiskId == dto.RiskId);

        if (plan is null)
        {
            plan = new TreatmentPlan { RiskId = dto.RiskId };
            _db.TreatmentPlans.Add(plan);
        }

        plan.Strategy = dto.Strategy;
        plan.Owner = dto.Owner;
        plan.DueDate = dto.DueDate;
        plan.Notes = dto.Notes;

        // Actualiza controles (borrado simple + reinsert)
        plan.TreatmentControls.Clear();
        foreach (var c in dto.Controls)
        {
            plan.TreatmentControls.Add(new TreatmentControl
            {
                Control27002Id = c.Control27002Id,
                Status = string.IsNullOrWhiteSpace(c.Status) ? "Planned" : c.Status,
                Evidence = c.Evidence,
                ImplementedAt = (c.Status == "Implemented") ? DateTime.UtcNow : null
            });
        }

        // Residual desde tratamiento
        risk.ResidualProbability = dto.ResidualProbability;
        risk.ResidualImpact = dto.ResidualImpact;

        // (si ya tienes RiskCalculator úsalo; si no, deja así)
        if (risk.ResidualProbability.HasValue && risk.ResidualImpact.HasValue)
        {
            risk.ResidualScore = risk.ResidualProbability.Value * risk.ResidualImpact.Value;

            risk.ResidualLevel =
                risk.ResidualScore >= 20 ? "Critical" :
                risk.ResidualScore >= 12 ? "High" :
                risk.ResidualScore >= 6 ? "Moderate" : "Low";
        }
        else
        {
            risk.ResidualScore = null;
            risk.ResidualLevel = null;
        }

        risk.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(plan);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var plan = await _db.TreatmentPlans.FindAsync(id);
        if (plan is null) return NotFound();

        _db.TreatmentPlans.Remove(plan);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
