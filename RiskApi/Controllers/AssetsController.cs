using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RiskApi.Data;
using RiskApi.Models;

namespace RiskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssetsController : ControllerBase
{
    private readonly RiskDbContext _db;
    public AssetsController(RiskDbContext db) => _db = db;

    [HttpGet]
    public async Task<List<Asset>> Get() => await _db.Assets.AsNoTracking().ToListAsync();

    [HttpPost]
    public async Task<IActionResult> Create(Asset asset)
    {
        _db.Assets.Add(asset);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = asset.Id }, asset);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var asset = await _db.Assets.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return asset is null ? NotFound() : Ok(asset);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Asset asset)
    {
        if (id != asset.Id) return BadRequest();
        _db.Entry(asset).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var asset = await _db.Assets.FindAsync(id);
        if (asset is null) return NotFound();
        _db.Assets.Remove(asset);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
