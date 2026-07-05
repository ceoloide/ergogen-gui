// Platform/OS detection utilities for UI and shortcut logic

export function isMacOS() {
  if (typeof navigator !== 'undefined') {
    // Use userAgentData.platform if available (case-insensitive)
    if ('userAgentData' in navigator && navigator.userAgentData) {
      const uaData = navigator.userAgentData as { platform?: string };
      if (uaData.platform) {
        // Some browsers return 'macOS', 'MacIntel', etc. Use case-insensitive match
        if (/mac/i.test(uaData.platform)) {
          return true;
        }
      }
    }
    // Fallback for browsers that don't support userAgentData
    if (/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return true;
    }
  }
  return false;
}

export function isWindows() {
  if (typeof navigator !== 'undefined') {
    if ('userAgentData' in navigator && navigator.userAgentData) {
      const uaData = navigator.userAgentData as { platform?: string };
      if (uaData.platform) {
        return uaData.platform.startsWith('Win');
      }
    }
    return /Win/.test(navigator.userAgent);
  }
  return false;
}

export function isLinux() {
  if (typeof navigator !== 'undefined') {
    if ('userAgentData' in navigator && navigator.userAgentData) {
      const uaData = navigator.userAgentData as { platform?: string };
      if (uaData.platform) {
        return uaData.platform.startsWith('Linux');
      }
    }
    return /Linux/.test(navigator.userAgent);
  }
  return false;
}

export function getPlatform() {
  if (isMacOS()) return 'mac';
  if (isWindows()) return 'windows';
  if (isLinux()) return 'linux';
  return 'other';
}

export function getModifierKey() {
  return isMacOS() ? '⌘' : 'Ctrl';
}

export function isMobile() {
  if (typeof navigator !== 'undefined') {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
  return false;
}
