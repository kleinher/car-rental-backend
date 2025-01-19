const { functions } = require('./Functions');
const { updateCar, getCarByPlateAndPhone } = require('../../client/CarsClient');
const { sendMessage } = require('../../client/MessageClient');
const { broadcast } = require('../../websocket/WebSocketServer.js');
const logger = require('../../config/logger');
require('dotenv').config();
const OpenAIApi = require("openai");
const openai = new OpenAIApi({
    organization: "org-D2c3Dmy65zgUxFJ2hOFTaqMX",
    project: "proj_O7LW7CupNKf0MzB0J1BPM3de",
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
        - Si el usuario cambia de tema o no responde, no hagas nada.
        - Si el usuario se niega o no quiere dar la información, no hagas nada.
        - Valida al final que la matricula del coche sea la correcta. Si no lo es, solicita los km para la matrícula correcta.
        - Habla formal pero no tanto, intenta ser un poco casual.
        - Evita preguntas abiertas, intenta que el usuario responda con un número.
        - Evita ofrecer ayuda o información adicional, solo guía la conversación para obtener los km.
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

function validateKm(licencePlate, phoneNumber, kmValidar) {
    let car = getCarByPlateAndPhone(licencePlate, phoneNumber);

    if (Number(car.kilometers) > Number(kmValidar)) {
        const errorMessage = `Los kilómetros para ${licencePlate} no son mayores que el anterior`;
        logger.error(errorMessage);
        return { error: errorMessage };
    }

    // Actualizamos los kilómetros del coche
    car.inMaintenance = (kmValidar - car.kilometers) > 9999 ? true : false;
    car.kilometers = kmValidar;
    car.reminderSent = false;
    car.reminderSentDate = null;

    car.lastUpdated = new Date();
    updateCar(car);
    broadcast();
    logger.info(`Updated car with licence plate ${licencePlate} for phone number ${phoneNumber}`);

    return { result: "Ok, km validados" };
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

            validationResponse = validateKm(parsed.licencePlate, phoneNumber, parsed.kmValidar);

            if (validationResponse.error) {
                messages.push({
                    role: "function",
                    name: "validateKm",
                    content: JSON.stringify({ error: validationResponse.error })
                });
                sendMessage(phoneNumber, validationResponse.error);
                logger.error(`Validation error: ${validationResponse.error}`);
            }
            else {
                delete conversationMap[`${phoneNumber}-${licencePlate}`];
                sendMessage(phoneNumber, "Kilómetros validados correctamente");
                logger.info(`Kilómetros validados correctamente para ${licencePlate}`);
                return { done: true };
            }
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