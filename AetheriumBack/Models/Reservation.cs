namespace AetheriumBack.Models;
public class Reservation
{
    public int ReservationId { get; set; }
    public int UserId { get; set; }
    public int FlightId { get; set; }
    public int? SeatId { get; set; }
    public User User { get; set; }
    public Flight Flight { get; set; }
    public Seat Seat { get; set; }
    public DateTimeOffset ReservationDateTime { get; set; }

#pragma warning disable CS8618 // Un campo que no acepta valores NULL debe contener un valor distinto de NULL al salir del constructor. Considere la posibilidad de agregar el modificador "required" o declararlo como un valor que acepta valores NULL.
    public Reservation() { }
#pragma warning restore CS8618 // Un campo que no acepta valores NULL debe contener un valor distinto de NULL al salir del constructor. Considere la posibilidad de agregar el modificador "required" o declararlo como un valor que acepta valores NULL.
}
