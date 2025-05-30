namespace AetheriumBack.Models;
public class Airport
{
    public string AirportCode { get; set; }
    public string AirportName { get; set; }
    public string City { get; set; }
    public string CountryCode { get; set; }
    public float Latitude { get; set; }
    public float Longitude { get; set; }
    public int ElevationFeet { get; set; }
    public string RegionCode { get; set; }
    public ICollection<Flight> DepartingFlights { get; set; }
    public ICollection<Flight> ArrivingFlights { get; set; }

    private Airport() { }
    public Airport(string[] attributes)
    {
        AirportCode = attributes[0];
        AirportName = attributes[1];
        City = attributes[2];
        CountryCode = attributes[3];
        Latitude = float.Parse(attributes[4]);
        Longitude = float.Parse(attributes[5]);
        ElevationFeet = int.Parse(attributes[6]);
        RegionCode = attributes[7];
        DepartingFlights = [];
        ArrivingFlights = [];
    }
}
