using AetheriumBack.Database;
using AetheriumBack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AetheriumBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AiportController : ControllerBase
{
    private readonly AetheriumContext _context;
    public AiportController(AetheriumContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAiports()
    {
        IEnumerable<Airport> airports = await _context.Airports.ToListAsync();

        var result = airports.Select(a => new
        {
            code = a.AirportCode,
            name = a.AirportName,
            city = a.City,
            country = a.RegionCode
        });

        return Ok(new { airports = result });
    }
}
