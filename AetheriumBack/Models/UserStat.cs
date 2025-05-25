namespace AetheriumBack.Models;

public class UserStat
{
    public int UserId { get; set; }
    public int TotalFlights { get; set; }
    public int TotalHours { get; set; } 
    public DateTimeOffset FirstFlight { get; set; }
    public DateTimeOffset LastFlight { get; set; }
    public int TimesInFirstClass { get; set; }
    public string MostUsedAirline { get; set; }
    public Decimal TotalSpent { get; set; }

#pragma warning disable CS8618 // Un campo que no acepta valores NULL debe contener un valor distinto de NULL al salir del constructor. Considere la posibilidad de agregar el modificador "required" o declararlo como un valor que acepta valores NULL.
    private UserStat() { }
#pragma warning restore CS8618 // Un campo que no acepta valores NULL debe contener un valor distinto de NULL al salir del constructor. Considere la posibilidad de agregar el modificador "required" o declararlo como un valor que acepta valores NULL.
}
