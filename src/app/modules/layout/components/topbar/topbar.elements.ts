import { marker as T } from '@biesbjerg/ngx-translate-extract-marker';
import { UiSearchableElement } from 'app/modules/global-search/interfaces/ui-searchable-element.interface';

export const toolBarElements = {
  hierarchy: [T('Toolbar')],
  elements: {
    sendFeedback: {
      hierarchy: [T('Send Feedback')],
    },
    alerts: {
      hierarchy: [T('Alerts')],
    },
  },
} satisfies UiSearchableElement;
