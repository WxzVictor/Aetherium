using AetheriumBack.Database;
using AetheriumBack.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AetheriumBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly AetheriumContext _context;

    public SearchController(AetheriumContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Search([FromBody] SearchRequestDto search)
    {
        if (string.IsNullOrWhiteSpace(search.Origin) || string.IsNullOrWhiteSpace(search.Destination))
        {
            return BadRequest("Origin and destination are required");
        }

        if (search.DepartureDate.Date < DateTime.UtcNow.Date)
        {
            return BadRequest("Departure date cannot be in the past");
        }

        IEnumerable<FlightResponseDto> outFlights = await _context.Flight
            .Include(f => f.DepartureAirport)
            .Include(f => f.ArrivalAirport)
            .Where(f =>
                (f.DepartureAirport.City == search.Origin || f.DepartureAirport.AirportCode == search.Origin) &&
                (f.ArrivalAirport.City == search.Destination || f.ArrivalAirport.AirportCode == search.Destination) &&
                f.DepartureTime.Date >= search.DepartureDate.Date)
            .Select(f => new FlightResponseDto
            {
                FlightId = f.FlightId,
                AirlineName = f.AirlineName,
                FlightCode = f.FlightCode,
                DepartureTime = f.DepartureTime,
                ArrivalTime = f.ArrivalTime,
                DurationMinutes = f.DurationMinutes,
                Price = f.Price,
                DepartureAirport = new AirportResponseDto
                {
                    City = f.DepartureAirport.City,
                    Code = f.DepartureAirport.AirportCode,
                    Name = f.DepartureAirport.AirportName
                },
                ArrivalAirport = new AirportResponseDto
                {
                    City = f.ArrivalAirport.City,
                    Code = f.ArrivalAirport.AirportCode,
                    Name = f.ArrivalAirport.AirportName
                }
            })
            .ToListAsync();

        IEnumerable<FlightResponseDto> returnFlights = Enumerable.Empty<FlightResponseDto>();
        if (search.ReturnDate.HasValue)
        {
            returnFlights = await _context.Flight
                .Include(f => f.DepartureAirport)
                .Include(f => f.ArrivalAirport)
                .Where(f =>
                    (f.DepartureAirport.City == search.Destination || f.DepartureAirport.AirportCode == search.Destination) &&
                    (f.ArrivalAirport.City == search.Origin || f.ArrivalAirport.AirportCode == search.Origin) &&
                    f.DepartureTime.Date == search.ReturnDate.Value.Date)
                .Select(f => new FlightResponseDto
                {
                    FlightId = f.FlightId,
                    AirlineName = f.AirlineName,
                    FlightCode = f.FlightCode,
                    DepartureTime = f.DepartureTime,
                    ArrivalTime = f.ArrivalTime,
                    DurationMinutes = f.DurationMinutes,
                    Price = f.Price,
                    DepartureAirport = new AirportResponseDto
                    {
                        City = f.DepartureAirport.City,
                        Code = f.DepartureAirport.AirportCode,
                        Name = f.DepartureAirport.AirportName
                    },
                    ArrivalAirport = new AirportResponseDto
                    {
                        City = f.ArrivalAirport.City,
                        Code = f.ArrivalAirport.AirportCode,
                        Name = f.ArrivalAirport.AirportName
                    }
                })
                .ToListAsync();
        }

        // Por si el usuario no marca la casilla de hoteles se inicializa a null
        HotelResponseDto? hotelResult = null;
        if (search.IncludeHotels)
        {
            IEnumerable<HotelDto> hotels = await _context.Hotel
                .Where(h => h.City.ToLower() == search.Destination.Trim().ToLower() || h.Country.ToLower() == search.Destination.Trim().ToLower())
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

            hotelResult = new HotelResponseDto
            {
                Total = hotels.Count(),
                Hotels = hotels
            };
        }

        SearchResponseDto response = new()
        {
            Flights = new FlightSearchResultDto
            {
                OutFlights = outFlights,
                ReturnFlights = returnFlights,
                TotalOut = outFlights.Count(),
                TotalReturn = returnFlights.Count(),
                LastUpdate = DateTimeOffset.UtcNow.Date
            },  
            Hotels = hotelResult
        };

        return Ok(response);
    }
}
