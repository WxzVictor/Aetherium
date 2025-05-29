namespace AetheriumBack.Models;
public class Reservation
{
    public int RerservationId { get; set; }
    public int UserId { get; set; }
    public int FlightId { get; set; }
    public int SeatId { get; set; }
    public User User { get; set; }
    public Flight Flight { get; set; }
    public Seat Seat { get; set; }
    public DateTimeOffset ReservationDateTime { get; set; }

    private Reservation() { }
    public Reservation(string[] attributes)
    {
        UserId = int.Parse(attributes[0]);
        FlightId = int.Parse(attributes[1]);
        SeatId = int.Parse(attributes[2]);
        ReservationDateTime = DateTimeOffset.Parse(attributes[3]);
    }
}
