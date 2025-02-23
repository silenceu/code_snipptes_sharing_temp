// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/
import 'dotenv/config';
import { createSqsQueues } from './sqs';
import config from './config';
import { createTopicsWithSubscriptions } from './sns';

(async () => {
    // 1. Create SQS
    const sqsArns = await createSqsQueues(config.namespace, config.sqs);
    // console.log(sqsArns);
    // 2. Create SNS
    await createTopicsWithSubscriptions({ sqsArns })
})();