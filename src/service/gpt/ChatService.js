const { functions } = require('./Functions');
const { updateCar, getCarByPlateAndPhone } = require('../../client/CarsClient');
const { sendMessage } = require('../../client/MessageClient');
const { broadcast } = require('../../websocket/WebSocketServer.js');
const logger = require('../../config/logger');

const OpenAIApi = require("openai");

const openai = new OpenAIApi({
    organization: "org-D2c3Dmy65zgUxFJ2hOFTaqMX",
    project: "proj_O7LW7CupNKf0MzB0J1BPM3de",
    apiKey: process.env.OPENAI_API_KEY
});

const conversationMap = {};

const gptContext =
    `
        Eres un asistente que guía la conversación para obtener los km del coche.
        - Si el usuario proporciona un valor numérico exacto (ej. "12000"), llama a la función "validateKm" con "kmActuales = 12000".
        - Si el usuario responde que enviará los datos más tarde (ej. "Te lo envío el martes"), responde "Perfecto, espero tu mensaje, gracias".
        - Si el usuario envía directamente un número (ej. "20000"), llama a la función "validateKm" con "kmActuales = 20000".
        - Si el usuario no da el dato pero promete enviarlo luego (ej. "Lo reviso y te aviso"), responde "Cuando puedas, por favor mándame los kilómetros".
        - Si el usuario escribe un valor no estándar (ej. "20k"), interpreta "20k" como 20000 y llama a "validateKm". 
          Si no es interpretable, solicita una aclaración (ej. "¿Te refieres a [valor numérico] km?").
        - Si el usuario cambia de tema o no responde, trata de guiarlo a la conversacion.
        - Si el usuario se niega o no quiere dar la información, lamentalo y termina la conversacion
        - Si necesita recordarle al usuario la matricula, hazlo.
        - Valida al final que la matricula del coche sea la correcta. Si no lo es, solicita los km para la matrícula correcta.
        - Evita hablar de otra cosa que no sea la validación de los km.
        - Si parece que el usuario no es responsable del coche, dale las gracias y termina la conversación.
        - No preguntes en que puedo ayudarte
        - Escribe formal pero amigable.
        - No cambies la matricula del coche que te interesa.
        - No cambies el contexto de la conversacion
        - No seas insistente ni muy repetitivo
        `
    ;

function getConversation(phoneNumber, licencePlate) {
    const key = `${phoneNumber}-${licencePlate}`;
    if (!conversationMap[key]) {
        conversationMap[key] = [
            {
                role: "system",
                content: `${gptContext}
                         - matricula: ${licencePlate}`
            }
        ];
    }
    return conversationMap[key];
}

// ***** MÉTODO PRINCIPAL *****
function validateKm(licencePlate, phoneNumber, kmValidar) {
    // 1. Obtener el coche y validaciones preliminares
    const car = checkCarExists(licencePlate, phoneNumber);
    checkKmIsGreater(car, kmValidar);

    // 2. Calcular la nueva tasa de uso diario
    const usageNow = calculateRecentDailyUsage(car, kmValidar);
    const newDailyUsage = averageDailyUsage(car.dailyUsage, usageNow);

    // 3. Predecir fecha para el próximo múltiplo de 10k
    const predictedDate = predictNext10kDate(kmValidar, newDailyUsage);

    // 4. Actualizar datos del coche y guardar
    updateCarData(car, kmValidar, newDailyUsage, predictedDate);

    // 5. Notificar y retornar resultado
    broadcast();
    logger.info(`Updated car with plate ${licencePlate} to ${kmValidar} km`);
    return { result: "Ok, km validados" };
}

// ***** SUB-FUNCIONES *****

/**
 * checkCarExists:
 *   - Busca el coche por patente y teléfono.
 *   - Lanza un error si no existe.
 */
function checkCarExists(licencePlate, phoneNumber) {
    const car = getCarByPlateAndPhone(licencePlate, phoneNumber);
    if (!car) {
        const err = `No se encontró el coche con patente ${licencePlate}.`;
        logger.error(err);
        throw new Error(err);
    }
    return car;
}

/**
 * checkKmIsGreater:
 *   - Verifica que los kilómetros nuevos sean mayores a los anteriores.
 *   - Lanza error si no se cumple.
 */
function checkKmIsGreater(car, kmValidar) {
    if (Number(car.kilometers) > Number(kmValidar)) {
        const err = `Los kilómetros ingresados para ${car.licensePlate} (${kmValidar}) ` +
            `no son mayores que el anterior (${car.kilometers}).`;
        logger.error(err);
        throw new Error(err);
    }
}

/**
 * calculateRecentDailyUsage:
 *   - Calcula cuántos km/día se usó desde la última actualización hasta hoy.
 */
function calculateRecentDailyUsage(car, kmValidar) {
    const previousKm = Number(car.kilometers);
    const today = new Date();
    const lastUpdateDate = new Date(car.lastUpdated);

    let daysDiff = (today - lastUpdateDate) / (1000 * 60 * 60 * 24);
    if (daysDiff < 1) {
        daysDiff = 1;
    }

    const kmDiff = kmValidar - previousKm;
    return kmDiff / daysDiff; // km/día
}

/**
 * averageDailyUsage:
 *   - Toma la tasa almacenada y la mezcla con la nueva para suavizar cambios.
 *   - Si no existía un dailyUsage previo, toma directamente la nueva tasa.
 */
function averageDailyUsage(oldUsage, newUsage) {
    if (!oldUsage || oldUsage <= 0) {
        return newUsage;
    }
    return (oldUsage + newUsage) / 2;
}

/**
 * predictNext10kDate:
 *   - Calcula la fecha aproximada en la que se alcanzará el próximo múltiplo de 10k,
 *     usando la tasa de uso diario.
 */
function predictNext10kDate(kmValidar, dailyUsage) {
    // Siguiente múltiplo de 10k
    let nextMilestone = Math.ceil(kmValidar / 10000) * 10000;
    if (nextMilestone === kmValidar) {
        nextMilestone += 10000;
    }

    const kmToNextMilestone = nextMilestone - kmValidar;
    let daysToMilestone = 999999; // valor por defecto si no hay uso diario
    if (dailyUsage && dailyUsage > 0) {
        daysToMilestone = kmToNextMilestone / dailyUsage;
    }

    const resultDate = new Date();
    resultDate.setDate(resultDate.getDate() + daysToMilestone);
    return resultDate.toISOString().split("T")[0];
}

/**
 * updateCarData:
 *   - Actualiza los campos del coche con la nueva información.
 *   - Guarda en "base de datos" y maneja flags de mantenimiento, etc.
 */
function updateCarData(car, kmValidar, dailyUsage, predictedDate) {
    // Actualizar km, fecha de última actualización
    car.kilometers = kmValidar;
    car.dailyUsage = dailyUsage;
    car.lastUpdated = new Date().toISOString().split("T")[0];
    car.estMaintainance = predictedDate;

    // Flags de mantenimiento (ejemplo simple)
    car.inMaintenance = (kmValidar % 10000 === 0);
    car.reminderSent = false;
    car.reminderSentDate = null;

    updateCar(car);
}


async function handleUserMessage(phoneNumber, licencePlate, userInput) {
    const messages = getConversation(phoneNumber, licencePlate);

    // 2. Agregamos el mensaje del usuario
    messages.push({ role: "user", content: userInput });
    logger.info(`User message added: ${userInput}`);

    // 3. Llamada a la API de OpenAI
    const gptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        functions: functions
    });

    const choice = gptResponse.choices[0];
    logger.info(`GPT response: ${JSON.stringify(choice)}`);

    if (choice.finish_reason === "function_call") {
        const { name, arguments } = choice.message.function_call;
        if (name === "validateKm") {
            const parsed = JSON.parse(arguments);
            logger.info(`Function call: ${name} with arguments: ${JSON.stringify(parsed)}`);

            try {
                validateKm(parsed.licencePlate, phoneNumber, parsed.kmValidar);
            }
            catch (error) {
                messages.push({
                    role: "function",
                    name: "validateKm",
                    content: JSON.stringify({ error: error.message })
                });
                sendMessage(phoneNumber, error.message);
                logger.error(`Validation error: ${error.message}`);
                return { done: false };
            }

            delete conversationMap[`${phoneNumber}-${licencePlate}`];
            sendMessage(phoneNumber, "Muchas gracias por la ayuda, saludos!");
            logger.info(`Kilómetros validados correctamente para ${licencePlate}`);
            return { done: true };
        }
    }
    // 4. Agregamos la respuesta del asistente al historial
    messages.push({
        role: "assistant",
        content: choice.message.content
    });
    sendMessage(phoneNumber, choice.message.content);
    logger.info(`Assistant response: ${choice.message.content}`);
    return { done: false };
}

module.exports = { handleUserMessage };