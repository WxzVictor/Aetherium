using Microsoft.AspNetCore.Mvc;
using AetheriumBack.Models;
using AetheriumBack.Dto;
using AetheriumBack.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace AetheriumBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationController : ControllerBase
{
    private readonly AetheriumContext _context;
    public ReservationController(AetheriumContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateReservation([FromBody] ReservationDto dto)
    {
        if (dto.UserId <= 0 || dto.FlightId <= 0)
            return BadRequest(new {
                error = "Validation error",
                message = "UserId and FlightId are required and must be greater than zero.",
                received = new { dto.UserId, dto.FlightId }
            });

        User? user = await _context.User.FindAsync(dto.UserId);
        if (user is null)
            return NotFound(new {
                error = "User not found",
                userId = dto.UserId
            });

        Flight? flight = await _context.Flight
            .Include(f => f.DepartureAirport)
            .Include(f => f.ArrivalAirport)
            .FirstOrDefaultAsync(f => f.FlightId == dto.FlightId);

        if (flight is null)
            return NotFound(new {
                error = "Flight not found",
                flightId = dto.FlightId
            });

        SeatResponseDto? seatDto = null;

        if (dto.SeatId.HasValue)
        {
            Seat? seat = await _context.Seat.FindAsync(dto.SeatId.Value);
            if (seat is null)
                return NotFound(new {
                    error = "Seat not found",
                    seatId = dto.SeatId.Value
                });
            if (seat.SeatStatus)
                return BadRequest(new {
                    error = "Seat already reserved",
                    seatId = seat.SeatId
                });

            seat.SeatStatus = true;
            _context.Seat.Update(seat);

            seatDto = new SeatResponseDto
            {
                SeatId = seat.SeatId,
                SeatNumber = seat.SeatNumber,
                SeatClass = seat.SeatClass.ToString(),
                SeatType = seat.SeatType.ToString(),
            };
        }

        Reservation reservation = new Reservation
        {
            UserId = dto.UserId,
            FlightId = dto.FlightId,
            SeatId = dto.SeatId,
            ReservationDateTime = DateTimeOffset.UtcNow
        };

        _context.Reservation.Add(reservation);
        await _context.SaveChangesAsync();

        ReservationResponseDto response = new ReservationResponseDto
        {
            ReservationId = reservation.ReservationId,
            UserId = reservation.UserId,
            ReservationDateTime = reservation.ReservationDateTime,
            FlightId = new FlightResponseDto
            {
                FlightId = flight.FlightId,
                AirlineName = flight.AirlineName,
                FlightCode = flight.FlightCode,
                DepartureTime = flight.DepartureTime,
                ArrivalTime = flight.ArrivalTime,
                DurationMinutes = flight.DurationMinutes,
                Price = flight.Price,
                DepartureAirport = new AirportResponseDto
                {
                    Name = flight.DepartureAirport.AirportName,
                    City = flight.DepartureAirport.City,
                    Code = flight.DepartureAirport.AirportCode
                },
                ArrivalAirport = new AirportResponseDto
                {
                    Name = flight.ArrivalAirport.AirportName,
                    City = flight.ArrivalAirport.City,
                    Code = flight.ArrivalAirport.AirportCode
                }
            },
            SeatId = seatDto
        };

        return Ok(response);
    }


    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetReservationsByUser(int userId)
    {
        var reservations = await _context.Reservation
            .Include(r => r.Flight.DepartureAirport)
            .Include(r => r.Flight.ArrivalAirport)
            .Include(r => r.Seat)
            .Where(r => r.UserId == userId)
            .ToListAsync();

        if (!reservations.Any())
            return NotFound(new {
                error = "No reservations found",
                userId = userId
            });

        var response = reservations.Select(r => new ReservationResponseDto
        {
            ReservationId = r.ReservationId,
            UserId = r.UserId,
            ReservationDateTime = r.ReservationDateTime,
            FlightId = new FlightResponseDto
            {
                FlightId = r.Flight.FlightId,
                AirlineName = r.Flight.AirlineName,
                FlightCode = r.Flight.FlightCode,
                DepartureTime = r.Flight.DepartureTime,
                ArrivalTime = r.Flight.ArrivalTime,
                DurationMinutes = r.Flight.DurationMinutes,
                Price = r.Flight.Price,
                DepartureAirport = new AirportResponseDto
                {
                    Name = r.Flight.DepartureAirport.AirportName,
                    City = r.Flight.DepartureAirport.City,
                    Code = r.Flight.DepartureAirport.AirportCode
                },
                ArrivalAirport = new AirportResponseDto
                {
                    Name = r.Flight.ArrivalAirport.AirportName,
                    City = r.Flight.ArrivalAirport.City,
                    Code = r.Flight.ArrivalAirport.AirportCode
                }
            },
            SeatId = r.SeatId is null ? null : new SeatResponseDto
            {
                SeatId = r.Seat.SeatId,
                SeatNumber = r.Seat.SeatNumber,
                SeatClass = r.Seat.SeatClass.ToString(),
                SeatType = r.Seat.SeatType.ToString()
            }
        }).ToList();

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetReservationById(int id)
    {
        Reservation? reservation = await _context.Reservation
            .Include(r => r.Flight.DepartureAirport)
            .Include(r => r.Flight.ArrivalAirport)
            .Include(r => r.Seat)
            .FirstOrDefaultAsync(r => r.ReservationId == id);

        if (reservation is null)
            return NotFound(new {
                error = "Reservation not found",
                reservationId = id
            });

        SeatResponseDto? seatDto = null;
        if (reservation.Seat is not null)
        {
            seatDto = new SeatResponseDto
            {
                SeatId = reservation.Seat.SeatId,
                SeatNumber = reservation.Seat.SeatNumber,
                SeatClass = reservation.Seat.SeatClass.ToString(),
                SeatType = reservation.Seat.SeatType.ToString()
            };
        }

        ReservationResponseDto response = new ReservationResponseDto
        {
            ReservationId = reservation.ReservationId,
            UserId = reservation.UserId,
            ReservationDateTime = reservation.ReservationDateTime,
            FlightId = new FlightResponseDto
            {
                FlightId = reservation.Flight.FlightId,
                AirlineName = reservation.Flight.AirlineName,
                FlightCode = reservation.Flight.FlightCode,
                DepartureTime = reservation.Flight.DepartureTime,
                ArrivalTime = reservation.Flight.ArrivalTime,
                DurationMinutes = reservation.Flight.DurationMinutes,
                Price = reservation.Flight.Price,
                DepartureAirport = new AirportResponseDto
                {
                    Name = reservation.Flight.DepartureAirport.AirportName,
                    City = reservation.Flight.DepartureAirport.City,
                    Code = reservation.Flight.DepartureAirport.AirportCode
                },
                ArrivalAirport = new AirportResponseDto
                {
                    Name = reservation.Flight.ArrivalAirport.AirportName,
                    City = reservation.Flight.ArrivalAirport.City,
                    Code = reservation.Flight.ArrivalAirport.AirportCode
                }
            },
            SeatId = seatDto
        };

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReservation(int id)
    {
        Reservation? reservation = await _context.Reservation
            .Include(r => r.Seat)
            .FirstOrDefaultAsync(r => r.ReservationId == id);

        if (reservation is null)
            return NotFound(new {
                error = "Reservation not found",
                reservationId = id
            });

        if (reservation.SeatId.HasValue)
        {
            reservation.Seat.SeatStatus = false;
            _context.Seat.Update(reservation.Seat);
        }

        _context.Reservation.Remove(reservation);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Reservation deleted successfully" });
    }
}
