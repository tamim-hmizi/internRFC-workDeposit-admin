import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });


export default async function handler(req, res) {
  const { personId, date } = req.query;

  if (!personId) {
    return res.status(400).json({ error: 'Missing personId' });
  }

  try {
    if (date) {
      const report = await getReportsByDate(personId, date);
      return res.status(200).json(report);
    } else {
      const reports = await getReportsByPersonId(personId);
      return res.status(200).json(reports);
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
    return res.status(500).json({ error: 'Failed to fetch reports' });
  }
}

async function getReportsByDate(personId, date) {
  const params = {
    TableName: 'WorkRapport',
    IndexName: 'personId-Date-index',
    KeyConditionExpression: 'personId = :personId AND #date = :date',
    ExpressionAttributeValues: {
      ':personId': { S: personId },
      ':date': { S: date },
    },
    ExpressionAttributeNames: {
      '#date': 'Date',
    },
  };

  const command = new QueryCommand(params);
  const response = await dynamoClient.send(command);

  const items = response.Items.map((item) => unmarshall(item));
  return items.length > 0 ? items[0] : { message: 'No report found for the selected date' };
}

async function getReportsByPersonId(personId) {
  const params = {
    TableName: 'WorkRapport',
    IndexName: 'personId-index',
    KeyConditionExpression: 'personId = :personId',
    ExpressionAttributeValues: {
      ':personId': { S: personId },
    },
  };

  const command = new QueryCommand(params);
  const response = await dynamoClient.send(command);

  const items = response.Items.map((item) => unmarshall(item));
  const todaysReports = items.filter((item) => item.Date === new Date().toISOString().split('T')[0]);
  const reportsByDate = items.reduce((acc, item) => {
    if (!acc[item.Date]) {
      acc[item.Date] = [];
    }
    acc[item.Date].push(item);
    return acc;
  }, {});

  return {
    todaysReports,
    reportsByDate,
  };
}
