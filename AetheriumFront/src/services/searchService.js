export async function buscarVuelosYHoteles(searchData) {
  const response = await fetch("http://localhost:5120/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchData)
  });
  if (!response.ok) throw new Error("Error en la búsqueda");
  return await response.json();
}