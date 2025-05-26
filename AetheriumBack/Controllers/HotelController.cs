using AetheriumBack.Database;
using AetheriumBack.Dto;
using AetheriumBack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AetheriumBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HotelController : ControllerBase
{
    private readonly AetheriumContext _context;
    public HotelController(AetheriumContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllHotels()
    {
        IEnumerable<Hotel> hotels = await _context.Hotel.ToListAsync();
        
        var response = new HotelRespondeDto
        {
            Total = hotels.Count(),
            Hotels = hotels
        };
        return Ok(response);
    }

    public async Task<IActionResult> GetHotelByCity(string ciudad)
    {
        if (string.IsNullOrEmpty(ciudad))
            return BadRequest("El campo de ciudad no puede estar vacio");

        IEnumerable<Hotel> hotels = await _context.Hotel
            .Where(h => h.City.ToLower() == ciudad.ToLower()).ToListAsync();

        if (!hotels.Any())
            return NotFound($"No hay hoteles para la ciudad: {ciudad}");

        return Ok(hotels);
    }
}
