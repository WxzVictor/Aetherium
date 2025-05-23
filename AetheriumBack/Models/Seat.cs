namespace AetheriumBack.Models;

public class Seat
{
    public Guid SeatId { get; set; }
    public Guid FlightId { get; set; }
    public string SeatNumber { get; set; }

    public Enum SeatClass = { 'Economy', 'Business', 'First' };

    public Enum SeatType = { 'Window', 'Aisle', 'Middle' };
    public Boolean SeatStatus { get; set; }
}
