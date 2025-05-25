namespace AetheriumBack.Models;

public class Seat
{
    public int SeatId { get; set; }
    public int FlightId { get; set; }
    public string SeatNumber { get; set; }

    public Enum SeatClass = { 'Economy', 'Business', 'First' };

    public Enum SeatType = { 'Window', 'Aisle', 'Middle' };
    public Boolean SeatStatus { get; set; }
}
