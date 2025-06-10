// Obtener todos los vuelos
export async function getAllFlights() {
    const res = await fetch('/api/Flight');
    if (!res.ok) throw new Error('Error al obtener vuelos');
    return res.json();
}

// Obtener vuelo por ID
export async function getFlightById(id) {
    const res = await fetch(`/api/Flight/${id}`);
    if (!res.ok) throw new Error('Error al obtener vuelo');
    return res.json();
}

// Obtener vuelos paginados
export async function getFlightsPaged(page = 1, pageSize = 10) {
    const res = await fetch(`/api/Flight/paged?page=${page}&pageSize=${pageSize}`);
    if (!res.ok) throw new Error('Error al obtener vuelos paginados');
    return res.json();
}

// Autocompletar aeropuertos
export async function autocompleteAirports(airport) {
    const res = await fetch(`/api/Flight/autocomplete?airport=${encodeURIComponent(airport)}`);
    if (!res.ok) throw new Error('Error en autocompletar aeropuertos');
    return res.json();
}

// Filtrar vuelos
export async function getFilteredFlights(params) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/Flight/filter?${query}`);
    if (!res.ok) throw new Error('Error al filtrar vuelos');
    return res.json();
}

// Obtener asientos disponibles para un vuelo
export async function getAvailableSeats(flightId) {
    const res = await fetch(`/api/Flight/${flightId}/available-seats`);
    if (!res.ok) throw new Error('Error al obtener asientos disponibles');
    return res.json();
}

export async function searchFlights(data) {
    const res = await fetch('/api/Flight/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al buscar vuelos');
    return res.json();
}