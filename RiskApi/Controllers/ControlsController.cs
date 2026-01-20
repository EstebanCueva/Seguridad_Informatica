using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RiskApi.Data;
using RiskApi.Models;

namespace RiskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ControlsController : ControllerBase
{
    private readonly RiskDbContext _db;
    public ControlsController(RiskDbContext db) => _db = db;

    [HttpGet]
    public async Task<List<Control27002>> Get() =>
        await _db.Controls.AsNoTracking().OrderBy(c => c.Code).ToListAsync();
}
