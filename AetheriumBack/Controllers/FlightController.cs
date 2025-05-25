using AetheriumBack.Database;
using AetheriumBack.Dto;
using AetheriumBack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AetheriumBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlightController : ControllerBase
{
    private readonly AetheriumContext _context;

    public FlightController(AetheriumContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllFlights()
    {
        var flights = await _context.Flight
            .Include(f => f.DepartureAirport)
            .Include(f => f.ArrivalAirport)
            .Select(f => new FlightResponseDto
            {
                FlightNumber = f.FlightNumber,
                AirlineName = f.AirlineName,
                FlightCode = f.FlightCode,
                DepartureAirport = new AirportResponseDto
                {
                    Name = f.DepartureAirport.AirportName,
                    City = f.DepartureAirport.City,
                    Code = f.DepartureAirport.AirportCode
                },
                ArrivalAirport = new AirportResponseDto
                {
                    Name = f.ArrivalAirport.AirportName,
                    City = f.ArrivalAirport.City,
                    Code = f.ArrivalAirport.AirportCode
                },
                DepartureTime = f.DepartureTime,
                ArrivalTime = f.ArrivalTime,
                DurationMinutes = f.DurationMinutes,
                Price = f.Price
            })
            .ToListAsync();

        var result = new FlightMetadaResponseDto
        {
            Flights = flights,
            TotalFlights = flights.Count,
            LastUpdate = DateTime.UtcNow.Date.ToString()
        };

        return Ok(result);
    }

    [HttpGet("search/{origen}/{destino}/{fechaSalida}/{fechaLlegada}")]
    public async Task<IActionResult> SearchFlights(string origen, string destino, DateTimeOffset fechaSalida, DateTimeOffset fechaLlegada)
    {
        var flights = await _context.Flight
            .Include()
    }
}

