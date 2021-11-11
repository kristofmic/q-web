import { isKeyHotkey } from 'is-hotkey';

export const isBoldHotkey = isKeyHotkey('mod+b');

export const isItalicHotkey = isKeyHotkey('mod+i');

export const isStrikethroughHotkey = isKeyHotkey('mod+shift+s');

export const isUnderlineHotkey = isKeyHotkey('mod+u');

export const isSoftBreakHotkey = isKeyHotkey('shift+enter');

export const isHardBreakHotkey = isKeyHotkey('enter');

export const isSpaceHotkey = isKeyHotkey('space');

export const isTabHotkey = isKeyHotkey('tab');

export const isShiftTabHotkey = isKeyHotkey('shift+tab');

export const isBackspaceHotkey = isKeyHotkey('backspace');

export const isDownArrowHotkey = isKeyHotkey('down');

export const isUpArrowHotkey = isKeyHotkey('up');

export const isLeftBracketHotkey = isKeyHotkey('mod+[');

export const isRightBracketHotkey = isKeyHotkey('mod+]');

export const isArrowDownHotkey = isKeyHotkey('ArrowDown');

export const isArrowUpHotkey = isKeyHotkey('ArrowUp');

export const isEscapeHotkey = isKeyHotkey('Escape');

export const isLinkHotkey = isKeyHotkey('mod+k');

export const isForwardSlashHotKey = isKeyHotkey('/');

export function hotkeyFactory(isHotkey, onMatch) {
  const isHotKeys = isHotkey instanceof Array ? isHotkey : [isHotkey];

  return {
    onKeyDown(event, editor, next) {
      if (!isHotKeys.some((check) => check(event))) {
        return next();
      }

      return onMatch(editor, event, next);
    },
  };
}
