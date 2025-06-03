using AetheriumBack.Models;

namespace AetheriumBack.Dto;
public class FlightResponseDto
{
    public int FlightId { get; set; }
    public string AirlineName { get; set; }
    public string FlightCode { get; set; }
    public AirportResponseDto DepartureAirport { get; set; }
    public AirportResponseDto ArrivalAirport { get; set; }
    public DateTimeOffset DepartureTime { get; set; }
    public DateTimeOffset ArrivalTime { get; set; }
    public int DurationMinutes { get; set; }
    public float Price { get; set; }
}
