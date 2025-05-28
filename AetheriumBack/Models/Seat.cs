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
    public int FlightId { get; set; }
    public string SeatNumber { get; set; }
    public SeatClass SeatClass { get; set; }
    public SeatType SeatType { get; set; }
    public Boolean SeatStatus { get; set; }
    public Flight Flight { get; set; }
    public Reservation Reservation { get; set; }

    private Seat() { }

    public Seat(string[] attributes)
    {
        FlightId = int.Parse(attributes[0]);
        SeatNumber = attributes[1];
        SeatClass = (SeatClass)Enum.Parse(typeof(SeatClass), attributes[2], true);
        SeatType = (SeatType)Enum.Parse(typeof(SeatType), attributes[3], true);
        SeatStatus = bool.Parse(attributes[4]);
    }
}
