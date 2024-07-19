import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export default async function handler(req, res) {
  try {
    // Define parameters for scanning the DynamoDB table
    const params = {
      TableName: 'Users',
      FilterExpression: '#role = :roleValue',
      ExpressionAttributeNames: {
        '#role': 'role'
      },
      ExpressionAttributeValues: {
        ':roleValue': 1
      }
    };

    
    const data = await dynamodb.scan(params).promise();
    const names = data.Items.map(item => item.name);
    res.status(200).json(names);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data from DynamoDB' });
  }
}
