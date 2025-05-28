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

    private UserStat() { }

    public UserStat(string[] attributes)
    {
        //UserId = int.Parse(attributes[0]);
        TotalFlights = int.Parse(attributes[1]);
        TotalHours = int.Parse(attributes[2]);
        FirstFlight = DateTimeOffset.Parse(attributes[3]);
        LastFlight = DateTimeOffset.Parse(attributes[4]);
        TimesInFirstClass = int.Parse(attributes[5]);
        MostUsedAirline = attributes[6];
        TotalSpent = Decimal.Parse(attributes[7]);
    }
}
