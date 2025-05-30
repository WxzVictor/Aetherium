using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AetheriumBack.Database.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
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
                name: "Hotel",
                schema: "Aetherium",
                columns: table => new
                {
                    HotelId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HotelName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Rating = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ContactNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PricePerNight = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    City = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Country = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CheckInTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CheckOutTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hotel", x => x.HotelId);
                });

            migrationBuilder.CreateTable(
                name: "User",
                schema: "Aetherium",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Age = table.Column<int>(type: "int", nullable: false),
                    SignUpDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "UserStat",
                schema: "Aetherium",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TotalFlights = table.Column<int>(type: "int", nullable: false),
                    TotalHours = table.Column<int>(type: "int", nullable: false),
                    FirstFlight = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastFlight = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    TimesInFirstClass = table.Column<int>(type: "int", nullable: false),
                    MostUsedAirline = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TotalSpent = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserStat", x => x.UserId);
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

            migrationBuilder.CreateTable(
                name: "Offer",
                schema: "Aetherium",
                columns: table => new
                {
                    OfferId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FlightId = table.Column<int>(type: "int", nullable: false),
                    HotelId = table.Column<int>(type: "int", nullable: false),
                    DiscountPercentage = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    EndDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Offer", x => x.OfferId);
                    table.ForeignKey(
                        name: "FK_Offer_Flight_FlightId",
                        column: x => x.FlightId,
                        principalSchema: "Aetherium",
                        principalTable: "Flight",
                        principalColumn: "FlightId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Offer_Hotel_HotelId",
                        column: x => x.HotelId,
                        principalSchema: "Aetherium",
                        principalTable: "Hotel",
                        principalColumn: "HotelId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Seat",
                schema: "Aetherium",
                columns: table => new
                {
                    SeatId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FlightId = table.Column<int>(type: "int", nullable: false),
                    SeatNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SeatClass = table.Column<int>(type: "int", nullable: false),
                    SeatType = table.Column<int>(type: "int", nullable: false),
                    SeatStatus = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seat", x => x.SeatId);
                    table.ForeignKey(
                        name: "FK_Seat_Flight_FlightId",
                        column: x => x.FlightId,
                        principalSchema: "Aetherium",
                        principalTable: "Flight",
                        principalColumn: "FlightId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reservation",
                schema: "Aetherium",
                columns: table => new
                {
                    RerservationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    FlightId = table.Column<int>(type: "int", nullable: false),
                    SeatId = table.Column<int>(type: "int", nullable: true),
                    ReservationDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservation", x => x.RerservationId);
                    table.ForeignKey(
                        name: "FK_Reservation_Flight_FlightId",
                        column: x => x.FlightId,
                        principalSchema: "Aetherium",
                        principalTable: "Flight",
                        principalColumn: "FlightId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reservation_Seat_SeatId",
                        column: x => x.SeatId,
                        principalSchema: "Aetherium",
                        principalTable: "Seat",
                        principalColumn: "SeatId");
                    table.ForeignKey(
                        name: "FK_Reservation_User_UserId",
                        column: x => x.UserId,
                        principalSchema: "Aetherium",
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
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

            migrationBuilder.CreateIndex(
                name: "IX_Offer_FlightId",
                schema: "Aetherium",
                table: "Offer",
                column: "FlightId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Offer_HotelId",
                schema: "Aetherium",
                table: "Offer",
                column: "HotelId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservation_FlightId",
                schema: "Aetherium",
                table: "Reservation",
                column: "FlightId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservation_SeatId",
                schema: "Aetherium",
                table: "Reservation",
                column: "SeatId",
                unique: true,
                filter: "[SeatId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Reservation_UserId",
                schema: "Aetherium",
                table: "Reservation",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Seat_FlightId",
                schema: "Aetherium",
                table: "Seat",
                column: "FlightId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Offer",
                schema: "Aetherium");

            migrationBuilder.DropTable(
                name: "Reservation",
                schema: "Aetherium");

            migrationBuilder.DropTable(
                name: "UserStat",
                schema: "Aetherium");

            migrationBuilder.DropTable(
                name: "Hotel",
                schema: "Aetherium");

            migrationBuilder.DropTable(
                name: "Seat",
                schema: "Aetherium");

            migrationBuilder.DropTable(
                name: "User",
                schema: "Aetherium");

            migrationBuilder.DropTable(
                name: "Flight",
                schema: "Aetherium");

            migrationBuilder.DropTable(
                name: "Airport",
                schema: "Aetherium");
        }
    }
}
