namespace AetheriumBack.Models;

public class UserStat
{
    public Guid UserId { get; set; }
    public int TotalFlights { get; set; }
    public int TotalHours { get; set; } 
    public DateTimeOffset FirstFlight { get; set; }
    public DateTimeOffset LastFlight { get; set; }
    public int TimesInFirstClass { get; set; }
    public string MostUsedAirline { get; set; }
    public Decimal TotalSpent { get; set; }
}
