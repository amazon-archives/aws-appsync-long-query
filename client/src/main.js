// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import Vue from 'vue';
import App from './App.vue';

import Amplify, * as AmplifyModules from 'aws-amplify';
import awsmobile from './aws-config';
Amplify.configure(awsmobile);

Vue.use(AmplifyModules);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
