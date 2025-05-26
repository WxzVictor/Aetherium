using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AetheriumBack.Database.Migrations
{
    /// <inheritdoc />
    public partial class initialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Aetherium");

            migrationBuilder.CreateTable(
                name: "Airport",
                schema: "Aetherium",
                columns: table => new
                {
                    AirportCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    AirportName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CountryCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Latitude = table.Column<float>(type: "real", nullable: false),
                    Longitude = table.Column<float>(type: "real", nullable: false),
                    ElevationFeet = table.Column<int>(type: "int", nullable: false),
                    RegionCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Airport", x => x.AirportCode);
                });

            migrationBuilder.CreateTable(
                name: "Flight",
                schema: "Aetherium",
                columns: table => new
                {
                    FlightId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AirlineName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FlightCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    DepartureAirportCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    ArrivalAirportCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    DepartureTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ArrivalTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DurationMinutes = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Flight", x => x.FlightId);
                    table.ForeignKey(
                        name: "FK_Flight_Airport_ArrivalAirportCode",
                        column: x => x.ArrivalAirportCode,
                        principalSchema: "Aetherium",
                        principalTable: "Airport",
                        principalColumn: "AirportCode");
                    table.ForeignKey(
                        name: "FK_Flight_Airport_DepartureAirportCode",
                        column: x => x.DepartureAirportCode,
                        principalSchema: "Aetherium",
                        principalTable: "Airport",
                        principalColumn: "AirportCode");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Flight_ArrivalAirportCode",
                schema: "Aetherium",
                table: "Flight",
                column: "ArrivalAirportCode");

            migrationBuilder.CreateIndex(
                name: "IX_Flight_DepartureAirportCode",
                schema: "Aetherium",
                table: "Flight",
                column: "DepartureAirportCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Flight",
                schema: "Aetherium");

            migrationBuilder.DropTable(
                name: "Airport",
                schema: "Aetherium");
        }
    }
}
