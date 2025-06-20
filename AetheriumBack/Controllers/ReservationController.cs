﻿using Microsoft.AspNetCore.Mvc;
using AetheriumBack.Models;
using AetheriumBack.Dto;
using AetheriumBack.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using AetheriumBack.Utils;

namespace AetheriumBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationController : ControllerBase
{
    private readonly AetheriumContext _context;
    private readonly SmtpSettings _smtpSettings;

    private static List<(Reservation Reserva, Flight Vuelo, Seat? Asiento)> _reservasPendientes = new();

    public ReservationController(AetheriumContext context, IOptions<SmtpSettings> smtpSettings)
    {
        _context = context;
        _smtpSettings = smtpSettings.Value;
    }

    private double ObtenerMultiplicadorClase(string clase)
    {
        return clase.ToLower() switch
        {
            "economy" => 1.0,
            "business" => 1.5,
            "first" => 2.0,
            _ => 1.0
        };
    }

    private double ObtenerSuplementoPorAsiento(string seatNumber)
    {
        var col = seatNumber.Length > 1 ? seatNumber.Substring(1) : "";
        return col switch
        {
            "1" or "3" => 15.0,
            "2" => 10.0,
            _ => 0.0
        };
    }

    [HttpPost]
    public async Task<IActionResult> CreateReservation([FromBody] ReservationDto dto)
    {
        if (dto.UserId <= 0 || dto.FlightId <= 0)
            return BadRequest("UserId and FlightId must be greater than zero");

        User? user = await _context.User.FindAsync(dto.UserId);
        if (user is null)
            return NotFound($"User with Id {dto.UserId} not found");

        Flight? flight = await _context.Flight
            .Include(f => f.DepartureAirport)
            .Include(f => f.ArrivalAirport)
            .FirstOrDefaultAsync(f => f.FlightId == dto.FlightId);

        if (flight is null)
            return NotFound($"Flight with Id {dto.FlightId} not found");

        SeatResponseDto? seatDto = null;

        if (dto.SeatId.HasValue)
        {
            Seat? seat = await _context.Seat.FindAsync(dto.SeatId.Value);
            if (seat is null)
                return NotFound($"Seat with Id {dto.SeatId.Value} not found");
            if (seat.SeatStatus)
                return BadRequest($"Seat with Id {seat.SeatId} is already reserved");

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

        Reservation reservation = new ()
        {
            UserId = dto.UserId,
            FlightId = dto.FlightId,
            SeatId = dto.SeatId,
            ReservationDateTime = DateTimeOffset.UtcNow
        };

        _context.Reservation.Add(reservation);
        await _context.SaveChangesAsync();

        double basePrice = flight.Price / 100.0;
        double multiplier = ObtenerMultiplicadorClase(dto.SeatClass ?? "economy");
        double priceWithMultiplier = basePrice * multiplier;

        double seatExtra = 0.0;
        if (seatDto is not null)
        {
            seatExtra = ObtenerSuplementoPorAsiento(seatDto.SeatNumber);
        }

        double totalPrice = dto.TotalPrice ?? (priceWithMultiplier + seatExtra);

        Seat? seatMemory = seatDto is null ? null : new Seat
        {
            SeatId = seatDto.SeatId,
            SeatNumber = seatDto.SeatNumber,
            SeatClass = Enum.Parse<SeatClass>(seatDto.SeatClass),
            SeatType = Enum.Parse<SeatType>(seatDto.SeatType)
        };

        _reservasPendientes.Add((reservation, flight, seatMemory));

        if (dto.SendEmail)
        {
            MemoryStream pdfStream = new();

            IDocument document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Content().Column(col =>
                    {
                        col.Item().Text("🛫 Confirmación de Reserva").FontSize(20).Bold();
                        col.Item().Text($"Nombre: {user.FirstName} {user.LastName}");
                        col.Item().Text($"Correo: {user.Email}");

                        foreach ((Reservation res, Flight flight, Seat? seat) in _reservasPendientes.Where(r => r.Reserva.UserId == dto.UserId))
                        {
                            col.Item().LineHorizontal(1);
                            col.Item().Text($"Vuelo: {flight.DepartureAirport.City} ➜ {flight.ArrivalAirport.City}");
                            col.Item().Text($"Fecha salida: {flight.DepartureTime:dd/MM/yyyy HH:mm}");
                            col.Item().Text($"Fecha llegada: {flight.ArrivalTime:dd/MM/yyyy HH:mm}");
                            col.Item().Text($"Código de vuelo: {flight.FlightCode}");

                            if (seat is not null)
                            {
                                double extra = ObtenerSuplementoPorAsiento(seat.SeatNumber);
                                double mult = ObtenerMultiplicadorClase(dto.SeatClass ?? "economy");
                                double total = flight.Price / 100.0 * mult + extra;
                                col.Item().Text($"Asiento: {seat.SeatNumber} – {seat.SeatType} ({extra:0.00} € extra)");
                                col.Item().Text($"Precio total: {total:0.00} €");
                            }
                        }
                    });
                });
            });

            document.GeneratePdf(pdfStream);
            pdfStream.Position = 0;

            MimeMessage message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(_smtpSettings.User));
            message.To.Add(MailboxAddress.Parse(user.Email));
            message.Subject = "Su reserva ha sido confirmada ✅";

            BodyBuilder bodyBuilder = new()
            {
                TextBody = "Gracias por reservar con Aetherium. Adjuntamos los detalles de sus vuelos.",
            };
            bodyBuilder.Attachments.Add("reserva.pdf", pdfStream.ToArray(), ContentType.Parse("application/pdf"));
            message.Body = bodyBuilder.ToMessageBody();

            try
            {
                using SmtpClient smtp = new();
                smtp.ServerCertificateValidationCallback = (s, c, h, e) => true;
                await smtp.ConnectAsync(_smtpSettings.Server, _smtpSettings.Port, SecureSocketOptions.Auto);
                await smtp.AuthenticateAsync(_smtpSettings.User, _smtpSettings.Password);
                await smtp.SendAsync(message);
                await smtp.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Error al enviar el correo: " + ex.Message);
            }

            _reservasPendientes.RemoveAll(r => r.Reserva.UserId == dto.UserId);
        }


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
        return NotFound("Reservation not found");

    if (reservation.SeatId.HasValue && reservation.Seat is not null)
    {
        reservation.Seat.SeatStatus = false;
        _context.Seat.Update(reservation.Seat);
    }

    _context.Reservation.Remove(reservation);
    await _context.SaveChangesAsync();

        ReservationDeleteResponseDto response = new()
        {
            ReservationId = reservation.ReservationId,
            DeletedAt = DateTimeOffset.UtcNow
        };

        return Ok(response);
    }
}
