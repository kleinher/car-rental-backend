const { functions } = require('./Functions');
const { updateCar, getCarByPlate, getAllCars } = require('../../client/CarsClient');
const { sendMessage } = require('../../client/MessageClient');
const { broadcast } = require('../../websocket/WebSocketServer.js');
const logger = require('../../config/logger');
require("dotenv").config();

const OpenAIApi = require("openai");
const CarRepository = require('../../repositories/CarRepository.js');

const openai = new OpenAIApi({
    organization: process.env.OPENAI_ORG,
    project: process.env.OPENAI_PROJECT,
    apiKey: process.env.OPENAI_API_KEY
});

const conversationMap = {};

const gptContext = `
    Eres un asistente diseñado para guiar la conversación y obtener los kilómetros actuales de un coche. Sigue estas pautas:

    1. **Provisión de kilómetros**:
       - Si el usuario proporciona un valor numérico exacto o estándar (ej. "12000" o "20k"), interpreta correctamente el valor (por ejemplo, "20k" como 20000) y llama a la función "validateKm" con "kmActuales".
       - Si el valor no es interpretable, solicita una aclaración educada (ej. "¿Te refieres a [valor numérico] km?").

    2. **Si el usuario promete enviar los datos más tarde**:
       - Responde de forma amable y espera el mensaje (ej. "Perfecto, espero tu mensaje, gracias" o "Cuando puedas, por favor mándame los kilómetros").

    3. **Cambio de tema o falta de respuesta**:
       - Redirige la conversación hacia la obtención de los kilómetros.
       - Si el usuario te escribe sobre otra cose, redirige la conversacion para obtener los kilometros

    4. **Negativa o no responsabilidad**:
       - Si el usuario se niega o aclara que no es responsable del coche, agradece y termina la conversación.
       - No digas estoy aquí para ayudarte, ya que el usuario no está solicitando ayuda.

    5. **Recordatorios y validaciones**:
       - Menciona la matrícula del coche si es necesario.
       - Asegúrate de que los kilómetros proporcionados correspondan a la matrícula correcta.

    6. **Tono y enfoque**:
       - Mantén un tono formal pero amigable.
       - No cambies el contexto de la conversación ni la matrícula de interés.
       - Sé claro, no repetitivo.
       - Usa la function call "sendMessage" para enviar cualquier respuesta al usuario.

    7. **Falta de información**:
       - Si el mensaje no tiene suficiente contexto, utiliza "doNothing". Ej: El usuario escribe solo "Hola"
`;

function getConversation(phoneNumber, licencePlate) {
    const key = `${phoneNumber}-${licencePlate}`;
    if (!conversationMap[key]) {
        conversationMap[key] = [
            {
                role: "system",
                content: `${gptContext}
                         - Mensaje ya enviado: Buenos dias, necesitamos que actualice los kilometros actuales del coche con matricula ${licencePlate}. Por favor, responda con el numero de kilometros actuales.`
            }
        ];
    }
    return conversationMap[key];
}

// ***** MÉTODO PRINCIPAL *****
async function validateKm(licencePlate, phoneNumber, kmValidar) {
    // 1. Obtener el coche y validaciones preliminares
    const car = await checkCarExists(licencePlate, phoneNumber);
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
async function checkCarExists(licencePlate) {
    const car = await CarRepository.findByPlate(licencePlate);
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

    CarRepository.update(car.licencePlate, car);
}

async function hadleMediaMessage(phoneNumber) {
    sendMessage(phoneNumber, "Me lo pasas en texto?");
}

async function handleUserMessage(phoneNumber, licencePlate, userInput) {
    const messages = getConversation(phoneNumber, licencePlate);

    messages.push({ role: "user", content: userInput });
    logger.info(`User message added: ${userInput}`);

    const gptResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        functions: functions
    });

    const choice = gptResponse.choices[0];
    logger.info(`GPT response: ${JSON.stringify(choice)}`);

    if (choice.finish_reason === "function_call") {
        const { name, arguments } = choice.message.function_call;
        if (name === "doNothing") {
            logger.info(`Function call: ${name}`);
            return { done: false };
        }
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
        if (name === "sendMessage") {

        }
    }

    messages.push({
        role: "assistant",
        content: choice.message.content
    });

    sendMessage(phoneNumber, choice.message.content);
    logger.info(`Assistant response: ${choice.message.content}`);
    return { done: false };
}

module.exports = { handleUserMessage, hadleMediaMessage };