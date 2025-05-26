using Microsoft.AspNetCore.Mvc;

namespace AetheriumBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlightController : ControllerBase
{
    //private readonly AetheriumContext _context;

    //public FlightController(AetheriumContext context)
    //{
    //    _context = context;
    //}

    //[HttpGet]
    //public async Task<IActionResult> GetAllFlights()
    //{
    //    IEnumerable<FlightResponseDto> flights = await _context.Flight
    //        .Include(f => f.DepartureAirport)
    //        .Include(f => f.ArrivalAirport)
    //        .Select(f => new FlightResponseDto
    //        {
    //            FlightNumber = f.FlightId,
    //            AirlineName = f.AirlineName,
    //            FlightCode = f.FlightCode,
    //            DepartureAirport = new AirportResponseDto
    //            {
    //                Name = f.DepartureAirport.AirportName,
    //                City = f.DepartureAirport.City,
    //                Code = f.DepartureAirport.AirportCode
    //            },
    //            ArrivalAirport = new AirportResponseDto
    //            {
    //                Name = f.ArrivalAirport.AirportName,
    //                City = f.ArrivalAirport.City,
    //                Code = f.ArrivalAirport.AirportCode
    //            },
    //            DepartureTime = f.DepartureTime,
    //            ArrivalTime = f.ArrivalTime,
    //            DurationMinutes = f.DurationMinutes,
    //            Price = f.Price
    //        })
    //        .ToListAsync();

    //    FlightMetadaResponseDto result = new()
    //    {
    //        Flights = flights,
    //        TotalFlights = flights.Count(),
    //        LastUpdate = DateTime.UtcNow
    //    };

    //    return Ok(result);
    //}

    //[HttpGet("search/{origen}/{destino}/{fechaSalida}/{fechaLlegada}")]
    //public async Task<IActionResult> SearchFlights(string origen, string destino, DateTimeOffset fechaSalida, DateTimeOffset fechaLlegada)
    //{
    //    IEnumerable<FlightResponseDto> flights = await _context.Flight
    //        .Include(f => f.DepartureAirport)
    //        .Include(f => f.ArrivalAirport)
    //        .Where(f => f.DepartureAirport.AirportCode == origen &&
    //            f.ArrivalAirport.AirportCode == destino &&
    //            f.DepartureTime.Date >= fechaSalida.Date &&
    //            f.ArrivalTime.Date <= fechaLlegada.Date)
    //        .Select(f => new FlightResponseDto
    //        {
    //            FlightNumber = f.FlightId,
    //            AirlineName = f.AirlineName,
    //            FlightCode = f.FlightCode,
    //            DepartureAirport = new AirportResponseDto
    //            {
    //                Name = f.DepartureAirport.AirportName,
    //                City = f.DepartureAirport.City,
    //                Code = f.DepartureAirport.AirportCode
    //            },
    //            ArrivalAirport = new AirportResponseDto
    //            {
    //                Name = f.ArrivalAirport.AirportName,
    //                City = f.ArrivalAirport.City,
    //                Code = f.ArrivalAirport.AirportCode
    //            },
    //            DepartureTime = f.DepartureTime,
    //            ArrivalTime = f.ArrivalTime,
    //            DurationMinutes = f.DurationMinutes,
    //            Price = f.Price
    //        })
    //        .ToListAsync();

    //    FlightMetadaResponseDto result = new()
    //    {
    //        Flights = flights,
    //        TotalFlights = flights.Count(),
    //        LastUpdate = DateTime.UtcNow
    //    };

    //    return Ok(result);
    //}

    //[HttpGet("{flightNumber}/available-seats")]
    //public async Task<IActionResult> GetAvailableSeats(int flightNumber)
    //{
    //    IEnumerable<SeatResponseDto> availableSeats = await _context.Seat
    //        .Where(s => s.FlightNumber == flightNumber && !s.SeatStatus)
    //        .Select(s => new SeatResponseDto
    //        {
    //            SeatId = s.SeatId,
    //            SeatNumber = s.SeatNumber,
    //            SeatClass = s.SeatClass.ToString(),
    //            SeatType = s.SeatType.ToString()
    //        })
    //        .ToListAsync();

    //    SeatAvailableDto result = new()
    //    {
    //        FlightNumber = flightNumber,
    //        AvailableSeats = availableSeats,
    //        TotalSeats = availableSeats.Count(),
    //        LastUpdate = DateTimeOffset.UtcNow
    //    };

    //    return Ok(result);
    //}
}

