import { createElement } from 'react';
import { experimental_Icon, experimental_useCodeTheme, type PluginAppBuilder } from '@get-bb/plugin-sdk/app';
import { artwork, iconMap } from './tabler.generated.ts';



export function registerTablerIcons(app: PluginAppBuilder): void {
  for (const [name, tabler] of Object.entries(iconMap)) {
    app.experimental_icons.register({
      name,
      component: function KujoIcon({ className }) {
        const { mode, name: theme } = experimental_useCodeTheme();
        const kujoPrefix = `bb:plugin:bb-kujo:kujo:${mode}`;
        if (!(theme === kujoPrefix || theme.startsWith(kujoPrefix + ':'))) {
          // bb explicitly resolves a same-name icon within its override to its builtin.
          // This preserves native artwork for other palettes without DOM observation.
          return createElement(experimental_Icon, { name, className });
        }
        return createElement('svg', {
          className, viewBox: '0 0 24 24', width: 24, height: 24,
          fill: 'none', stroke: 'currentColor', strokeWidth: 2,
          strokeLinecap: 'round', strokeLinejoin: 'round',
          'aria-hidden': true, focusable: false, 'data-kujo-icon': tabler,
        }, ...artwork[tabler].map(([tag, attributes], key) => createElement(tag, { ...attributes, key })));
      },
    });
  }
}
