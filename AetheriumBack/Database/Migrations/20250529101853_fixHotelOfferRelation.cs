using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AetheriumBack.Database.Migrations
{
    /// <inheritdoc />
    public partial class fixHotelOfferRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Offer_Flight_FlightId",
                schema: "Aetherium",
                table: "Offer");

            migrationBuilder.DropIndex(
                name: "IX_Offer_HotelId",
                schema: "Aetherium",
                table: "Offer");

            migrationBuilder.CreateIndex(
                name: "IX_Offer_HotelId",
                schema: "Aetherium",
                table: "Offer",
                column: "HotelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Offer_Flight_FlightId",
                schema: "Aetherium",
                table: "Offer",
                column: "FlightId",
                principalSchema: "Aetherium",
                principalTable: "Flight",
                principalColumn: "FlightId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Offer_Flight_FlightId",
                schema: "Aetherium",
                table: "Offer");

            migrationBuilder.DropIndex(
                name: "IX_Offer_HotelId",
                schema: "Aetherium",
                table: "Offer");

            migrationBuilder.CreateIndex(
                name: "IX_Offer_HotelId",
                schema: "Aetherium",
                table: "Offer",
                column: "HotelId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Offer_Flight_FlightId",
                schema: "Aetherium",
                table: "Offer",
                column: "FlightId",
                principalSchema: "Aetherium",
                principalTable: "Flight",
                principalColumn: "FlightId");
        }
    }
}
