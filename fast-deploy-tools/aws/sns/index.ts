import {
    SNSClient,
    CreateTopicCommand,
    SubscribeCommand,
    SubscribeCommandOutput,
} from '@aws-sdk/client-sns';
import credentials from '../credentials';
import config, { snsTags, awsSdkRetryStrategy } from '../config';
const client = new SNSClient({
    region: process.env.AWS_REGION,
    credentials,
    retryStrategy: awsSdkRetryStrategy,
});

export async function createTopicsWithSubscriptions(params: {
    sqsArns?: { [name: string]: string | undefined };
}) {
    for (const sns of config.sns) {
        const createTopicCommand = new CreateTopicCommand({
            Name: `${config.namespace}_${sns.name}`,
            Attributes: {
                DisplayName: sns.displayName,
            },
            Tags: snsTags,
        });
        const snsCreatedResp = await client.send(createTopicCommand);
        for (const subscription of sns.subscriptions) {
            let endpoint: string = '';
            if (['sqs'].includes(subscription.protocol)) {
                endpoint = (params.sqsArns || {})[subscription.name] || '';
            }
            if (!endpoint) {
                console.log(`${subscription.name} doesn't have endpoint`);
                continue;
            }
            console.log(snsCreatedResp.TopicArn, endpoint)
            const subscribeCommand = new SubscribeCommand({
                TopicArn: snsCreatedResp.TopicArn,
                Protocol: subscription.protocol,
                Endpoint: endpoint,
                Attributes: {
                    FilterPolicy: JSON.stringify(subscription.filterPolicy),
                }
            });

            const subscribeResp: SubscribeCommandOutput =
                await client.send(subscribeCommand);

            console.info(`[SNS], ${subscription.name} subscribes SNS ${sns.name}: ${JSON.stringify(subscribeResp)}`);
        }
    }
}
