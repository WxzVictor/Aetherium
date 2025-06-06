namespace AetheriumBack.Models;

public class Flight
{
    public int FlightId { get; set; }
    public string AirlineName { get; set; }
    public string FlightCode { get; set; }
    public string DepartureAirportCode { get; set; }
    public string ArrivalAirportCode { get; set; }
    public DateTimeOffset DepartureTime { get; set; }
    public DateTimeOffset ArrivalTime { get; set; }
    public int DurationMinutes { get; set; }
    public float Price { get; set; }
    public Airport DepartureAirport { get; set; }
    public Airport ArrivalAirport { get; set; }
    public Offer Offer { get; set; }
    public ICollection<Reservation> Reservation { get; set; }
    public ICollection<Seat> Seat { get; set; }

#pragma warning disable CS8618 // Un campo que no acepta valores NULL debe contener un valor distinto de NULL al salir del constructor. Considere la posibilidad de agregar el modificador "required" o declararlo como un valor que acepta valores NULL.
    private Flight() { }
#pragma warning restore CS8618 // Un campo que no acepta valores NULL debe contener un valor distinto de NULL al salir del constructor. Considere la posibilidad de agregar el modificador "required" o declararlo como un valor que acepta valores NULL.

    public Flight(string[] attributes)
    {
        // FlightId = int.Parse(attributes[0]);
        AirlineName = attributes[1];
        FlightCode = attributes[2];
        DepartureAirportCode = attributes[3];
        ArrivalAirportCode = attributes[4];
        DepartureTime = DateTimeOffset.Parse(attributes[5]);
        ArrivalTime = DateTimeOffset.Parse(attributes[6]);
        DurationMinutes = int.Parse(attributes[7]);
        Price = float.Parse(attributes[8]);
    }

}
