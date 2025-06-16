using AetheriumBack.Database;
using AetheriumBack.Utils;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Infrastructure;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AetheriumContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var port = Environment.GetEnvironmentVariable("PORT") ?? "3000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseCors("AllowFrontend");
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

AetheriumContext context = app.Services.CreateScope().ServiceProvider.GetRequiredService<AetheriumContext>();
if (!context.Seat.Any())
{
    await app.Services.SeedDataAsync();
}

// Configurar la licencia de QuestPDF
QuestPDF.Settings.License = LicenseType.Community;

app.Run();
