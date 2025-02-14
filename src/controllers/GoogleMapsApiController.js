require("dotenv").config();

async function getPlaces(req, res) {
    try {
        const { place } = req.query; // El frontend envía el lugar buscado
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
            params: {
                query: place,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error en la solicitud a Google Maps" });
    }
}
module.exports = { getPlaces }