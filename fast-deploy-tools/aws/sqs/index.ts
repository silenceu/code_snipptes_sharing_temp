import { SQSClient, CreateQueueCommand } from '@aws-sdk/client-sqs';
import credentials from '../credentials';
import config, { awsSdkRetryStrategy, SQS } from '../config';

const client = new SQSClient({
    region: process.env.AWS_REGION,
    credentials,
    retryStrategy: awsSdkRetryStrategy,
});

export async function createSqsQueues(namespace: string, queues: SQS[]) {
    const sqsArns: Record<string, string | undefined> = {};
    for (const queue of queues) {
        const queueName = `${namespace}_${queue.name}`;
        const createQueueCommand = new CreateQueueCommand({
            QueueName: `${namespace}_${queue.name}`,
            tags: config.tags,
        });

        const createQueueResp = await client.send(createQueueCommand);

        console.info(
            `[SQS], Create the new sqs queue ${queue.name}: ${JSON.stringify(createQueueResp)}`,
        );

        sqsArns[queue.name] = `arn:aws:sqs:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:${queueName}`;
    }
    return sqsArns;
}
