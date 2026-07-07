import { trackEvent } from './analytics';
import guiPkg from '../../package.json';
import ergogenPkg from 'ergogen/package.json';

describe('trackEvent', () => {
  const originalGtag = window.gtag;
  const originalEnv = process.env.REACT_APP_ERGOGEN_VERSION;

  beforeEach(() => {
    // Reset window.gtag before each test
    window.gtag = jest.fn();
    // Reset environment variable before each test
    process.env.REACT_APP_ERGOGEN_VERSION = originalEnv;
  });

  afterAll(() => {
    // Restore original window.gtag and environment variable
    window.gtag = originalGtag;
    process.env.REACT_APP_ERGOGEN_VERSION = originalEnv;
  });

  it('should call window.gtag with GUI and Ergogen versions when it is defined', () => {
    const eventName = 'test_event';
    const eventParams = { param1: 'value1', param2: 123 };

    trackEvent(eventName, eventParams);

    expect(window.gtag).toHaveBeenCalledWith('event', eventName, {
      event_category: 'user_action',
      gui_version: guiPkg.version,
      ergogen_version: `github:ergogen/ergogen#v${ergogenPkg.version}`,
      param1: 'value1',
      param2: 123,
    });
  });

  it('should call window.gtag with default category and versions when eventParams is not provided', () => {
    const eventName = 'test_event';

    trackEvent(eventName);

    expect(window.gtag).toHaveBeenCalledWith('event', eventName, {
      event_category: 'user_action',
      gui_version: guiPkg.version,
      ergogen_version: `github:ergogen/ergogen#v${ergogenPkg.version}`,
    });
  });

  it('should allow overriding event_category', () => {
    const eventName = 'test_event';
    const eventParams = { event_category: 'custom_category' };

    trackEvent(eventName, eventParams);

    expect(window.gtag).toHaveBeenCalledWith('event', eventName, {
      event_category: 'custom_category',
      gui_version: guiPkg.version,
      ergogen_version: `github:ergogen/ergogen#v${ergogenPkg.version}`,
    });
  });

  it('should reflect custom Ergogen versions from environment variables', () => {
    process.env.REACT_APP_ERGOGEN_VERSION = 'github:ceoloide/ergogen#v4.3.0';
    const eventName = 'test_event';

    trackEvent(eventName);

    expect(window.gtag).toHaveBeenCalledWith('event', eventName, {
      event_category: 'user_action',
      gui_version: guiPkg.version,
      ergogen_version: 'github:ceoloide/ergogen#v4.3.0',
    });
  });

  it('should not throw or call anything when window.gtag is undefined', () => {
    (window as any).gtag = undefined;

    expect(() => trackEvent('test_event')).not.toThrow();
  });
});
