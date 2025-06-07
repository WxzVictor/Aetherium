namespace AetheriumBack.Dto;
public class SearchRequestDto
{
    public string Origin { get; set; }
    public string Destination { get; set; }
    public DateTimeOffset DepartureDate { get; set; }
    public DateTimeOffset? ReturnDate { get; set; }
    public int Passengers { get; set; }
    public string CabinClass { get; set; }
    public bool IncludeHotels { get; set; }
}
