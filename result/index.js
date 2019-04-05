// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

////
const axios = require('axios');

////
const PublishResultMutation = `mutation PublishResult(
    $id: ID!,
    $status: ResultStatus!,
    $listings: [String]!
  ) {
    publishResult(result: {id: $id, status: $status, listings: $listings}) {
      id
      status
      listings
    }
  }`;

/**
 * Executes mutation on AppSync API.
 */
const executeMutation = async(id) => {
  const mutation = {
    query: PublishResultMutation,
    operationName: 'PublishResult',
    variables: {
      id: id,
      status: 'COMPLETE',
      listings: [ "foo", "bar" ]
    },
  };

  try {
    let response = await axios({
      method: 'POST',
      url: process.env.APPSYNC_ENDPOINT,
      data: JSON.stringify(mutation),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.APPSYNC_API_KEY,
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error(`[ERROR] ${error.response.status} - ${error.response.data}`);
    throw error;
  }
};

/**
 * Main handler function.
 */
exports.handler = async(event) => {
  await executeMutation(event.name);
  return { message: `finished` };
}