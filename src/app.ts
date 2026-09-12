import { definePluginApp } from '@get-bb/plugin-sdk/app';
import { mountSignal } from './effects.ts';

export default definePluginApp(app => {
  app.contentScripts.register({ id: 'kujo-signal', mount: mountSignal });
});
