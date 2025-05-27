using AetheriumBack.Database;
using AetheriumBack.Models;
using CsvHelper;
using System.Globalization;

namespace AetheriumBack.Utils;

public class LoadCsv
{
    private readonly AetheriumContext _context;

    public LoadCsv(AetheriumContext context)
    {
        _context = context;
    }

    public void ImportAirports(string FilePath)
    {
        using var reader = new StreamReader(FilePath);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

        var records = csv.GetRecords<Airport>().ToList();

        _context.Airports.AddRange(records);
        _context.SaveChanges();
    }
}
