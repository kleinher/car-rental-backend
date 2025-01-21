const functions = [
    {
        name: "validateKm",
        description: "Valida los km introducidos",
        parameters: {
            type: "object",
            properties: {
                kmValidar: {
                    type: "integer", // en vez de number
                    description: "Valor numérico de los km a validar (entero)"
                },
                licencePlate: {
                    type: "string",
                    description: "Matrícula del coche"
                },
            },
            required: ["kmValidar", "licencePlate"]
        }
    },

    {
        name: "doNothing",
        description: "No hace nada",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    }

];

module.exports = { functions };