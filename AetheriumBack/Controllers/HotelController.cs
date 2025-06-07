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
        IEnumerable<HotelDto> hotels = await _context.Hotel
            .Select(h => new HotelDto
            {
                HotelId = h.HotelId,
                HotelName = h.HotelName,
                Address = h.Address,
                Rating = h.Rating,
                ContactNumber = h.ContactNumber,
                PricePerNight = h.PricePerNight,
                City = h.City,
                Country = h.Country,
                Email = h.Email,
                CheckInTime = h.CheckInTime,
                CheckOutTime = h.CheckOutTime
            })
            .ToListAsync();

        HotelResponseDto response = new()
        {
            Total = hotels.Count(),
            Hotels = hotels
        };

        return Ok(response);
    }

    [HttpGet("filter")]
    public async Task<IActionResult> GetFilterHotels(string? country, string? city, decimal? minRating, decimal? maxPrice, decimal? minPrice)
    {
        IQueryable<Hotel> query = _context.Hotel.AsQueryable();

        if (!string.IsNullOrEmpty(country))
        {
            query = query.Where(h => h.Country.ToLower() == country.Trim().ToLower());
        }

        if (!string.IsNullOrEmpty(city))
        {
            query = query.Where(h => h.City.ToLower() == city.Trim().ToLower());
        }

        if (minRating.HasValue)
        {
            query = query.Where(h => h.Rating >= minRating.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(h => h.PricePerNight <= maxPrice.Value);
        }

        if (minPrice.HasValue)
        {
            query = query.Where(h => h.PricePerNight >= minPrice.Value);
        }

        IEnumerable<HotelDto> hotels = await query
            .Select(h => new HotelDto
            {
                HotelId = h.HotelId,
                HotelName = h.HotelName,
                Address = h.Address,
                Rating = h.Rating,
                ContactNumber = h.ContactNumber,
                PricePerNight = h.PricePerNight,
                City = h.City,
                Country = h.Country,
                Email = h.Email,
                CheckInTime = h.CheckInTime,
                CheckOutTime = h.CheckOutTime
            })
            .ToListAsync();

        HotelResponseDto response = new()
        {
            Total = hotels.Count(),
            Hotels = hotels
        };

        return Ok(response);
    }
}
