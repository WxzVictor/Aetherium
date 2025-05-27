using AetheriumBack.Database;

namespace AetheriumBack.Utils;

public static class LoadCsv
{
    public static async void SeedDataAsync(IServiceProvider services)
    {
        using IServiceScope scope = services.CreateScope();
        AetheriumContext context = scope.ServiceProvider.GetRequiredService<AetheriumContext>();

        if (!context.Airports.Any())
        {
            string path = Directory.GetCurrentDirectory() + "\\Data";
            IEnumerable<string> files = Directory.GetFiles(Directory.GetCurrentDirectory() + "\\Data");

            if (files.Any())
            {
                foreach (string file in files)
                {
                    using StreamReader reader = new(file);
                    while (!reader.EndOfStream)
                    {
                        string? line = reader.ReadLine();
                        string[] values = line.Split(',');

                        //Airport aux = new();
                    }
                }
            }
            //foreach (string? line in lines)
            //{
            //    string[] parts = line.Split(',');
            //    context.Airports.Add(new Airport { Name = parts[0], Code = parts[1] });
            //}
            await context.SaveChangesAsync();
        }
    }

}
