import axios from 'axios';
import {
  convertFromRaw,
  convertToRaw,
  EditorProps,
  EditorState
} from 'draft-js';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createHashtagPlugin from 'draft-js-hashtag-plugin';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createMentionPlugin from 'draft-js-mention-plugin';
import Editor from 'draft-js-plugins-editor';
import createEditorStateWithText from 'draft-js-plugins-editor/lib/utils/createEditorStateWithText';
import { cloneDeep, isString, noop } from 'lodash';
import React, { useRef, useState } from 'react';

import Mention from './mention';
import MentionEntry from './mention-entry';

const positionSuggestions = ({ state, props }) => {
  let transform;
  let transition;

  if (state.isActive && props.suggestions.length > 0) {
    transform = 'scaleY(1)';
    transition = 'all 0.25s cubic-bezier(.3,1.2,.2,1)';
  } else if (state.isActive) {
    transform = 'scaleY(0)';
    transition = 'all 0.25s cubic-bezier(.3,1,.2,1)';
  }

  return {
    transform,
    transition
  };
};

const emojiPlugin = createEmojiPlugin();
const hashtagPlugin = createHashtagPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
const linkifyPlugin = createLinkifyPlugin({
  target: '_blank',
  rel: 'noopener noreferrer'
});

const mentionPlugin = createMentionPlugin({
  entityMutability: 'IMMUTABLE',
  positionSuggestions,
  mentionPrefix: '@',
  supportWhitespace: true,
  mentionComponent: Mention
});

const plugins = [
  emojiPlugin,
  hashtagPlugin,
  inlineToolbarPlugin,
  linkifyPlugin,
  mentionPlugin
];

const { EmojiSuggestions } = emojiPlugin;
const { InlineToolbar } = inlineToolbarPlugin as any;
const { MentionSuggestions } = mentionPlugin;

const getEditorState = (val) => {
  const value = cloneDeep(val);
  let parsed;
  try {
    parsed = JSON.parse(JSON.parse(value));
  } catch (e) {
    parsed = value;
  }
  let state;
  if (isString(parsed)) {
    state = createEditorStateWithText(parsed);
  } else {
    state = EditorState.createWithContent(convertFromRaw(parsed));
  }
  return state;
};

interface ContentViewProps
  extends Omit<EditorProps, 'editorState' | 'onChange'> {
  value?: any;
  onChange?: (value: any) => void;
}

const ContentView: React.FC<ContentViewProps> = ({
  value = '',
  onChange = noop,
  readOnly = true,
  ...editorPropsRest
}) => {
  const [editorState, setEditorState] = useState(getEditorState(value));
  const [suggestions, setSuggestions] = useState<Array<any>>([]);
  const editor = useRef<any>(null);

  const focus = () => {
    editor.current.focus();
  };

  const handleChange = (editorState: any) => {
    const currentContent = editorState.getCurrentContent();
    if (currentContent.getPlainText().length === 0) {
      onChange('');
    } else {
      onChange(JSON.stringify(convertToRaw(currentContent)));
    }
    setEditorState(editorState);
  };

  const onSearchChange = async ({ value }) => {
    try {
      const res = await axios.get(
        `/api/v1/users/search?name=${encodeURIComponent(value)}`
      );
      if (res.data) {
        setSuggestions(res.data);
      }
    } catch (err) {
      console.error('failed to get mentions', err);
    }
  };

  const editorProps: any = {
    spellCheck: true,
    stripPastedStyles: true,
    readOnly,
    ...editorPropsRest
  };

  return (
    <div onClick={focus}>
      <Editor
        plugins={plugins}
        onChange={handleChange}
        editorState={editorState}
        ref={editor}
        {...editorProps}
      />
      {!readOnly ? (
        <>
          <MentionSuggestions
            onSearchChange={onSearchChange}
            suggestions={suggestions}
            entryComponent={MentionEntry}
          />
          <EmojiSuggestions />
          <InlineToolbar />
        </>
      ) : null}
    </div>
  );
};

export default ContentView;
