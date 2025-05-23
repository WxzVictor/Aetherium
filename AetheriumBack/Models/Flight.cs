namespace AetheriumBack.Models;

public class Flight
{
    public Guid FlightId { get; set; }
    public string FlightNumber { get; set; }
    public string AirlineName { get; set; }
    public string FlightCode { get; set; }
    public string DepartureAirportCode { get; set; }
    public string ArrivalAirportCode { get; set; }
    public DateTimeOffset DepartureTime { get; set; }
    public DateTimeOffset ArrivalTime { get; set; }
    public int DurationMinutes { get; set; }
    public float price { get; set; }

#pragma warning disable CS8618 // Un campo que no acepta valores NULL debe contener un valor distinto de NULL al salir del constructor. Considere la posibilidad de agregar el modificador "required" o declararlo como un valor que acepta valores NULL.
    private Flight() { }
#pragma warning restore CS8618 // Un campo que no acepta valores NULL debe contener un valor distinto de NULL al salir del constructor. Considere la posibilidad de agregar el modificador "required" o declararlo como un valor que acepta valores NULL.
}
