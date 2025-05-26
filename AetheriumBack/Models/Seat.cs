namespace AetheriumBack.Models;

public enum SeatClass
{
    Economy,
    Business,
    First
}
public enum SeatType
{
    Window,
    Aisle,
    Middle
}
public class Seat
{
    public int SeatId { get; set; }
    public int FlightNumber { get; set; }
    public string SeatNumber { get; set; }
    public SeatClass SeatClass { get; set; }
    public SeatType SeatType { get; set; }
    public Boolean SeatStatus { get; set; }
}
