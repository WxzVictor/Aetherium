export const createReservation = async (reservationDto, token) => {
  try {
    const response = await fetch('/api/reservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservationDto),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "No se pudo crear la reserva.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createReservation:", error);
    throw error;
  }
};

export const getReservationsByUser = async (userId, token) => {
  try {
    const response = await fetch(`/api/reservation/user/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron cargar las reservas.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getReservationsByUser:", error);
    return [];
  }
};

export const deleteReservation = async (reservationId, token) => {
  try {
    const response = await fetch(`/api/reservation/${reservationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudo eliminar la reserva.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en deleteReservation:", error);
    throw error;
  }
};
