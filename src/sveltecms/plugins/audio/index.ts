import type { CMSPlugin } from "sveltecms/core/Plugin";
import Audio from "./Audio.svelte";
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
  fieldTypes: [
    {
      id: 'audio',
      default: undefined,
      widget: 'audio',
      handlesMedia: true,
      displayComponent: 'sveltecms/plugins/audio/Audio',
      displays: {
        default: 'none',
        page: 'div',
      }
    }
  ],
  components: [
    {
      id: 'sveltecms/plugins/audio/Audio',
      component: Audio,
    }
  ],
  conf: {
    fields: {
      audio: {
        type: 'audio',
        widget: 'audio',
        mediaStore: {
          type: 'staticFiles',
          mediaDirectory: 'audio',
          allowMediaTypes: [
            'audio/*'
          ]
        }
      }
    }
  }
}

export default AudioPlugin