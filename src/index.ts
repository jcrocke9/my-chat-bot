// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { config } from 'dotenv';
import * as path from 'path';
import * as restify from 'restify';

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import { BotFrameworkAdapter } from 'botbuilder';

// This bot's main dialog.
import { MyBot } from './bot';

const ENV_FILE = path.join(__dirname, '..', '.env');
config({ path: ENV_FILE });

// Create HTTP server.
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    console.log(`\nTo test your bot, see: https://aka.ms/debug-with-emulator`);
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: "f2998d50-d724-4a48-9b37-dc9e29ee1c8c", //process.env.MicrosoftAppID,
    appPassword: "doormen-fond-vasser1" //process.env.MicrosoftAppPassword
});
// Map knowledge base endpoint values from .env file into the required format for `QnAMaker`.
const configuration = {
    knowledgeBaseId: "4db22f8b-3ef2-465c-8817-2526dceaba02",// process.env.QnAKnowledgebaseId,
    endpointKey: "5dd7f00f-ceb7-404f-be04-faf443a7e656", //process.env.QnAAuthKey,
    host: "https://statetreeanswer.azurewebsites.net/qnamaker" //process.env.QnAEndpointHostName
 };

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    console.error(`\n [onTurnError]: ${ error }`);
    // Send a message to the user
    await context.sendActivity(`Oops. Something went wrong!`);
};

// Create the main dialog.
const myBot = new MyBot(configuration, {});

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Route to main dialog.
        await myBot.run(context);
    });
});
