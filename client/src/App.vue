<!--
  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
  SPDX-License-Identifier: MIT-0
-->
<template>
  <div id="app">
    <button @click="search()" :disabled="this.loading">Search</button>
    <p v-if="this.loading">Loading...</p>
    <p>Query ID: {{ this.queryId }}</p>
    <p>Query Status: {{ this.status }}</p>
    <p>Listings: {{ JSON.stringify(this.listings) }}</p>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";

const searchQuery = `query Search($text: String!) {
  search(text: $text) {
    id
    status
  }
}`;

const onSearchResultSubscription = `subscription OnSearchResult($queryId: ID!) {
  onSearchResult(id: $queryId) {
    id
    status
    listings
  }
}`;


export default {
  name: 'app',

  data: function() {
    return {
      loading: false,
      queryId: null,
      status: "",
      listings: []
    }
  },
  
  methods: {
    search: async function() {
      this.loading = true;
      // 1. Submit search query
      const { data: { search } } = await API.graphql(
        graphqlOperation(searchQuery, { text: 'test' })
      );
      this.queryId = search.id;
      this.status = search.status;

      // 2. Subscribe to search result
      const subscription = API.graphql(
          graphqlOperation(onSearchResultSubscription, { queryId: this.queryId })
        ).subscribe({
          next: ({ value: { data: { onSearchResult }}}) => {
            this.loading = false;
            // Stop receiving data updates from the subscription
            this.status = onSearchResult.status;
            this.listings = onSearchResult.listings;
            subscription.unsubscribe();
          }
        });
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
