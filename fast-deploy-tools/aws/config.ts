import path from "path";
import _ from "lodash";
import YAML from "yaml";
import { Tag as SnsTag } from "@aws-sdk/client-sns";
import { ConfiguredRetryStrategy } from "@smithy/util-retry";
import { readFileSync } from "node:fs";

interface S3 {}

interface SNS {
	name: string;
	displayName: string;
	subscriptions: Subscription[];
}

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sns/command/SubscribeCommand/
interface Subscription {
	protocol: "sqs" | "http" | "email" | "lambda";
	name: string;
	filterPolicy: FilterPolicy | null;
}

interface FilterPolicy {
	event: string[];
	orderChannel?: OrderChannelElement[];
}

type OrderChannelElement = OrderChannelClass | number;

interface OrderChannelClass {
	exists: boolean;
}

export interface SQS {
	name: string;
}

interface StorehubAWSDeployConfig {
	namespace: string;
	tags: {
		[key: string]: string;
	};
	sns: SNS[];
	sqs: SQS[];
	s3: S3[];
}

const config = YAML.parse(
	readFileSync(path.join(__dirname, "./conf.yml")).toString(),
) as StorehubAWSDeployConfig;

// config.sns.forEach((sns) => {
//     sns.name = `storehub_${sns.name}_${process.env.ENV}`;
//     sns.subscriptions.forEach((subscription) => {
//         if (subscription.protocol === 'sqs') {
//             subscription.name = `storehub_${subscription.name}_${process.env.ENV}`;
//         }
//     });
// });

// config.sqs.forEach((sqs) => {
//     sqs.name = `storehub_${sqs.name}_${process.env.ENV}`;
// });

const snsTags: SnsTag[] = _.map(config.tags, (Value, Key) => {
	return { Key, Value };
});

const awsSdkRetryStrategy = new ConfiguredRetryStrategy(
	5,
	(attempt: number) => attempt * 1000,
);

export { snsTags, awsSdkRetryStrategy };

export default config;
