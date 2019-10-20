// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { QnAMaker } from 'botbuilder-ai';
import { ActivityHandler } from 'botbuilder';

export class MyBot extends ActivityHandler {
    constructor(configuration, qnaOptions) {
        super();
        if (!configuration) throw new Error('[QnaMakerBot]: Missing parameter. configuration is required');
        // now create a qnaMaker connector.
        let qnaMaker = new QnAMaker(configuration, qnaOptions);
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context: any, next) => {
            // send user input to QnA Maker.
            const qnaResults = await qnaMaker.getAnswers(context);

            // If an answer was received from QnA Maker, send the answer back to the user.
            if (qnaResults[0]) {
                await context.sendActivity(`${qnaResults[0].answer}`);
            }
            else {
                // If no answers were returned from QnA Maker, reply with help.
                await context.sendActivity('No QnA Maker response was returned.'
                    + 'This example uses a QnA Maker Knowledge Base that focuses on smart light bulbs. '
                    + `Ask the bot questions like "Why won't it turn on?" or "I need help."`);
            }
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity('Hello and welcome!');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}
