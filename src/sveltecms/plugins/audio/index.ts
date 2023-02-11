import type { CMSPlugin } from "sveltecms/core/Plugin";
import CmsWidgetAudio from "./CMSWidgetAudio.svelte";

export const AudioPlugin:CMSPlugin = {
  id: 'audio',
  widgetTypes: [
    {
      id: 'audio',
      description: 'Widget for input of audio files',
      widget: CmsWidgetAudio,
      fieldTypes: ['audio'],
      handlesFields: true,
      handlesMedia: true,
      handlesMultiple: true,
    }
  ],
  conf: {
    fields: {
      audio: {
        type: 'file',
        widget: 'audio',
        mediaTypes: ['audio/*'],
        mediaStore: {
          type: 'staticFiles',
          mediaDirectory: 'audio',
        }
      }
    }
  }
}

export default AudioPlugin