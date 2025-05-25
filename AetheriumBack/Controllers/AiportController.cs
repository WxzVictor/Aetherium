using AetheriumBack.Database;
using AetheriumBack.Dto;
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
        IEnumerable<AirportDto> airports = await _context.Airports
            .Select(a => new AirportDto
            {
                Code = a.AirportCode,
                Name = a.AirportName,
                City = a.City,
                CountryCode = a.CountryCode
            })
            .ToListAsync();

        return Ok(airports);
    }
}
