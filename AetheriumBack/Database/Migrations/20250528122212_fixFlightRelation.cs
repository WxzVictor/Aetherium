using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AetheriumBack.Database.Migrations
{
    /// <inheritdoc />
    public partial class fixFlightRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Flight_Airport_ArrivalAirportCode",
                schema: "Aetherium",
                table: "Flight");

            migrationBuilder.DropForeignKey(
                name: "FK_Flight_Airport_DepartureAirportCode",
                schema: "Aetherium",
                table: "Flight");

            migrationBuilder.DropForeignKey(
                name: "FK_Offer_Hotel_HotelId",
                schema: "Aetherium",
                table: "Offer");

            migrationBuilder.AddForeignKey(
                name: "FK_Flight_Airport_ArrivalAirportCode",
                schema: "Aetherium",
                table: "Flight",
                column: "ArrivalAirportCode",
                principalSchema: "Aetherium",
                principalTable: "Airport",
                principalColumn: "AirportCode");

            migrationBuilder.AddForeignKey(
                name: "FK_Flight_Airport_DepartureAirportCode",
                schema: "Aetherium",
                table: "Flight",
                column: "DepartureAirportCode",
                principalSchema: "Aetherium",
                principalTable: "Airport",
                principalColumn: "AirportCode");

            migrationBuilder.AddForeignKey(
                name: "FK_Offer_Hotel_HotelId",
                schema: "Aetherium",
                table: "Offer",
                column: "HotelId",
                principalSchema: "Aetherium",
                principalTable: "Hotel",
                principalColumn: "HotelId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Flight_Airport_ArrivalAirportCode",
                schema: "Aetherium",
                table: "Flight");

            migrationBuilder.DropForeignKey(
                name: "FK_Flight_Airport_DepartureAirportCode",
                schema: "Aetherium",
                table: "Flight");

            migrationBuilder.DropForeignKey(
                name: "FK_Offer_Hotel_HotelId",
                schema: "Aetherium",
                table: "Offer");

            migrationBuilder.AddForeignKey(
                name: "FK_Flight_Airport_ArrivalAirportCode",
                schema: "Aetherium",
                table: "Flight",
                column: "ArrivalAirportCode",
                principalSchema: "Aetherium",
                principalTable: "Airport",
                principalColumn: "AirportCode",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Flight_Airport_DepartureAirportCode",
                schema: "Aetherium",
                table: "Flight",
                column: "DepartureAirportCode",
                principalSchema: "Aetherium",
                principalTable: "Airport",
                principalColumn: "AirportCode",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Offer_Hotel_HotelId",
                schema: "Aetherium",
                table: "Offer",
                column: "HotelId",
                principalSchema: "Aetherium",
                principalTable: "Hotel",
                principalColumn: "HotelId");
        }
    }
}
