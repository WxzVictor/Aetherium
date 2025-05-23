import Flight from './Flight.js';
import User from './User.js';
import Airport from './Airport.js';
import Hotel from './Hotel.js';
import Offer from './Offer.js';
import Reservation from './Reservation.js';
import Seat from './Seat.js';
import UserStat from './UserStat.js';

// Relaciones entre los modelos
Flight.hasMany(Seat, { foreignKey: 'flightId' });
Seat.belongsTo(Flight, { foreignKey: 'flightId' });

Flight.hasMany(Reservation, { foreignKey: 'flightId' });
Reservation.belongsTo(Flight, { foreignKey: 'flightId' });

User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

Flight.belongsTo(Airport, { as: 'departureAirport' , foreignKey: 'departureAirportCode' });
Flight.belongsTo(Airport, { as: 'arrivalAirport', foreignKey: 'arrivalAirportCode' });

Hotel.hasMany(Reservation, { foreignKey: 'hotelId' });
Reservation.belongsTo(Hotel, { foreignKey: 'hotelId' });

User.hasMany(UserStat, { foreignKey: 'userId' });
UserStat.belongsTo(User, { foreignKey: 'userId' });

export { Flight, User, Airport, Hotel, Offer, Reservation, Seat, UserStat };
