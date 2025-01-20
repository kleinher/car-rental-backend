const initialCars = [
    {
        id: 1,
        model: "Toyota Corolla",
        user: "Juan",
        userId: 1,
        kilometers: 12000,
        lastUpdated: "2024-01-06",
        licensePlate: "ABC123",
        phoneNumber: "5493743515495",
        reminderSent: false,
        reminderSentDate: null,
        inMaintenance: false,
        lastMaintainance: "2024-01-01",

        // Campos opcionales nuevos:
        dailyUsage: 0, // km/día (promedio histórico)
        estMaintainance: null, // fecha estimada para alcanzar el siguiente múltiplo de 10k
    },
    {
        id: 2,
        model: "Honda Civic",
        user: "Ana",
        userId: 1,
        kilometers: 15000,
        lastUpdated: "2025-01-05",
        licensePlate: "DEF456",
        phoneNumber: "5493743515495",
        reminderSent: false,
        reminderSentDate: null,
        inMaintenance: false,
        lastMaintainance: "2024-01-01",

        dailyUsage: 0,
        estMaintainance: null,
    },
    {
        id: 3,
        model: "Ford Focus",
        user: "Carlos",
        userId: 1,
        kilometers: 8000,
        lastUpdated: "2025-01-04",
        licensePlate: "GHI789",
        phoneNumber: "5493743515495",
        reminderSent: false,
        reminderSentDate: null,
        inMaintenance: false,
        lastMaintainance: null,

        dailyUsage: 0,
        estMaintainance: null,
    },
    {
        id: 4,
        model: "Chevrolet Cruze",
        user: "Maria",
        userId: 1,
        kilometers: 20000,
        lastUpdated: "2025-01-03",
        licensePlate: "JKL012",
        phoneNumber: "5493743515495",
        reminderSent: false,
        reminderSentDate: null,
        inMaintenance: false,
        lastMaintainance: null,

        dailyUsage: 0,
        estMaintainance: null,
    },
];


module.exports = initialCars;

