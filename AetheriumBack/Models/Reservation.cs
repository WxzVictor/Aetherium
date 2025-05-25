namespace AetheriumBack.Models;
public class Reservation
{
    public int RerservationId { get; set; }
    public int UserId { get; set; }
    public int FlightId { get; set; }
    public int SeatId { get; set; }
    public DateTimeOffset ReservationDateTime { get; set; }
}
