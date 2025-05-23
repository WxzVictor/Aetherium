namespace AetheriumBack.Models;

public class Hotel
{
    public Guid HotelId { get; set; }
    public string HotelName { get; set; }
    public string Address { get; set; }
    public int Rating { get; set; }
    public string ContactNumber { get; set; }
    public decimal PricePerNight { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string Emain { get; set; }
    public DateTimeOffset CheckInTime { get; set; }
    public DateTimeOffset CheckOutTime { get; set; }

#pragma warning disable CS8618 // Un campo que no acepta valores NULL debe contener un valor distinto de NULL al salir del constructor. Considere la posibilidad de agregar el modificador "required" o declararlo como un valor que acepta valores NULL.
    private Hotel() { }
#pragma warning restore CS8618 // Un campo que no acepta valores NULL debe contener un valor distinto de NULL al salir del constructor. Considere la posibilidad de agregar el modificador "required" o declararlo como un valor que acepta valores NULL.

}
