const ERGOGEN_LANGUAGE_ID = 'ergogen';

/**
 * Registers a custom language definition for Ergogen with the Monaco Editor.
 * This function sets up syntax highlighting for reserved keywords in Ergogen's YAML configuration.
 *
 * It checks if the language has already been registered to avoid duplication.
 * @param {any} monaco - The Monaco Editor instance.
 */
export const registerErgogenLanguage = (monaco: any) => {
  if (!monaco) {
    return;
  }
  // Check if the language is already registered
  const existingLanguages = monaco.languages.getLanguages();
  if (existingLanguages.some((lang: any) => lang.id === ERGOGEN_LANGUAGE_ID)) {
    return;
  }

  // Register the new language
  monaco.languages.register({id: ERGOGEN_LANGUAGE_ID});

  // Define the language's syntax highlighting rules
  monaco.languages.setMonarchTokensProvider(ERGOGEN_LANGUAGE_ID, {
    tokenizer: {
      root: [
        // Highlight top-level keywords
        [/^(\s*)\b(meta|units|points|outlines|cases|pcbs)\b:/, [{token: ''}, {token: 'keyword'}, {token: ''}]],

        // Other YAML tokens
        [/[a-zA-Z0-9_]+/, 'variable'],
        [/".*?"/, 'string'],
        [/'.*?'/, 'string'],
        [/#.*$/, 'comment'],
      ],
    },
  });

  // Define a custom theme for the new language
  monaco.editor.defineTheme('ergogen-theme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      {token: 'keyword', foreground: '9650c8', fontStyle: 'bold'},
    ],
    colors: {}
  });
};