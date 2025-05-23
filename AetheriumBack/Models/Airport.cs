namespace AetheriumBack.Models;

public class Airport
{
    public string AirportCode { get; set; }
    public string AirportName { get; set; }
    public string City { get; set; }
    public float Latitude { get; set; }
    public float Longitude { get; set; }
    public int ElevationFeet { get; set; }
    public string RegionCode { get; set; }

#pragma warning disable CS8618 // Un campo que no acepta valores NULL debe contener un valor distinto de NULL al salir del constructor. Considere la posibilidad de agregar el modificador "required" o declararlo como un valor que acepta valores NULL.
    private Airport() { }
#pragma warning restore CS8618 // Un campo que no acepta valores NULL debe contener un valor distinto de NULL al salir del constructor. Considere la posibilidad de agregar el modificador "required" o declararlo como un valor que acepta valores NULL.

}
