using AetheriumBack.Database;
using AetheriumBack.Dto;
using AetheriumBack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

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
        IEnumerable<FlightResponseDto> flights = await _context.Flight
            .Include(f => f.DepartureAirport)
            .Include(f => f.ArrivalAirport)
            .Select(f => new FlightResponseDto
            {
                FlightId = f.FlightId,
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

        FlightMetadaResponseDto result = new()
        {
            Flights = flights,
            TotalFlights = flights.Count(),
            LastUpdate = DateTime.UtcNow
        };

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetFlightById(int id)
    {
        FlightResponseDto? flight = await _context.Flight
            .Include(f => f.DepartureAirport)
            .Include(f => f.ArrivalAirport)
            .Where(f => f.FlightId == id)
            .Select(f => new FlightResponseDto
            {
                FlightId = f.FlightId,
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
            .FirstOrDefaultAsync();

        if (flight is null)
            return NotFound($"Flight with ID {id} not found.");

        return Ok(flight);
    }

    [HttpGet("paged")]
    public async Task<IActionResult> GetAllFlightsPaged(int page = 1, int pageSize = 10)
    {
        IQueryable<Flight> query = _context.Flight
            .Include(f => f.DepartureAirport)
            .Include(f => f.ArrivalAirport);

        IEnumerable<FlightResponseDto> flights = await query
            .OrderBy(f => f.DepartureTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(f => new FlightResponseDto
            {
                FlightId = f.FlightId,
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

        // TOTAL PARA MOSTRAR EN EL FRONT
        int totalFlights = await query.CountAsync();

        FlightMetadaResponseDto result = new()
        {
            Flights = flights,
            TotalFlights = totalFlights,
            LastUpdate = DateTimeOffset.UtcNow.Date
        };

        return Ok(result);
    }

    [HttpPost("search")]
    public async Task<IActionResult> SearchFlights([FromBody] FlightSearchDto search)
    {
        if (string.IsNullOrWhiteSpace(search.Origin) || string.IsNullOrWhiteSpace(search.Destination))
            return BadRequest("Origin and destination are required");

        if (search.DepartureDate.Date < DateTime.UtcNow.Date)
            return BadRequest("Departure date cannot be in the past");

        // VUELOS IDA
        IEnumerable<FlightResponseDto> outFlights = await _context.Flight
            .Include(f => f.DepartureAirport)
            .Include(f => f.ArrivalAirport)
            .Where(f => (f.DepartureAirport.AirportCode == search.Origin || f.DepartureAirport.City == search.Origin) &&
                        (f.ArrivalAirport.AirportCode == search.Destination || f.ArrivalAirport.City == search.Destination) &&
                f.DepartureTime.Date >= search.DepartureDate.Date)
            .Select(f => new FlightResponseDto
            {
                FlightId = f.FlightId,
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

        //VUELOS VUELTA
        IEnumerable<FlightResponseDto> returnFlights = await _context.Flight
            .Include(f => f.DepartureAirport)
            .Include(f => f.ArrivalAirport)
            .Where(f => (f.DepartureAirport.AirportCode == search.Destination || f.DepartureAirport.City == search.Destination) &&
                        (f.ArrivalAirport.AirportCode == search.Origin || f.ArrivalAirport.City == search.Origin) &&
                        f.DepartureTime.Date == search.ReturnDate.Date)
            .Select(f => new FlightResponseDto
            {
                FlightId = f.FlightId,
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


        FlightSearchResultDto result = new()
        {
            OutFlights = outFlights,
            ReturnFlights = returnFlights,
            TotalOut = outFlights.Count(),
            TotalReturn = returnFlights.Count(),
            LastUpdate = DateTimeOffset.Now.Date
        };

        return Ok(result);
    }

    [HttpGet("autocomplete")]
    public async Task<IActionResult> AutocompleteAirports([FromQuery] string airport)
    {
        airport = airport.ToLower();

        IEnumerable<AirportAutocompleteDto> result = await _context.Airports
            .Where(a => a.AirportCode.ToLower().Contains(airport) ||
                        a.AirportName.ToLower().Contains(airport) ||
                        a.City.ToLower().Contains(airport))
            .Select(a => new AirportAutocompleteDto
            {
                City = a.City,
                AirportName = a.AirportName,
                Code = a.AirportCode
            })
            .Distinct()
            .Take(10)
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("filter")]
    public async Task<IActionResult> GetFilteredFlights(string? origin, string? destination, DateTime? departureDate, float? minPrice, float? maxPrice, string? airline)
    {
        //Consulta para hacer filtros
        IQueryable<Flight> query = _context.Flight
            .Include(f => f.DepartureAirport)
            .Include(f => f.ArrivalAirport)
            .AsQueryable();

        // Filtros
        if (!string.IsNullOrWhiteSpace(origin)) 
        {
            query = query.Where(f => f.DepartureAirport.AirportCode.ToLower() == origin.Trim().ToLower() || f.DepartureAirport.City.ToLower() == origin.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(destination))
        {
            query = query.Where(f => f.ArrivalAirport.AirportCode.ToLower() == destination.Trim().ToLower() || f.ArrivalAirport.City.ToLower() == destination.Trim().ToLower());
        }

        if (departureDate.HasValue)
        {
            query = query.Where(f => f.DepartureTime.Date == departureDate.Value.Date);
        }

        if (minPrice.HasValue)
        {
            query = query.Where(f => f.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(f => f.Price <= maxPrice.Value);
        }

        if (!string.IsNullOrWhiteSpace(airline))
        {
            query = query.Where(f => f.AirlineName.Contains(airline));
        }

        IEnumerable<FlightResponseDto> flights = await query
            .Select(f => new FlightResponseDto
            {
                FlightId = f.FlightId,
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

        FlightMetadaResponseDto result = new()
        {
            Flights = flights,
            TotalFlights = flights.Count(),
            LastUpdate = DateTimeOffset.UtcNow.Date
        };

        return Ok(result);
    }

    [HttpGet("{flightId}/available-seats")]
    public async Task<IActionResult> GetAvailableSeats(int flightId)
    {
        IEnumerable<SeatResponseDto> availableSeats = await _context.Seat
            .Where(s => s.FlightId == flightId && !s.SeatStatus)
            .Select(s => new SeatResponseDto
            {
                SeatId = s.SeatId,
                SeatNumber = s.SeatNumber,
                SeatClass = s.SeatClass.ToString(),
                SeatType = s.SeatType.ToString()
            })
            .ToListAsync();

        SeatAvailableDto result = new()
        {
            FlightId = flightId,
            AvailableSeats = availableSeats,
            TotalSeats = availableSeats.Count(),
            LastUpdate = DateTimeOffset.UtcNow
        };

        return Ok(result);
    }
}

