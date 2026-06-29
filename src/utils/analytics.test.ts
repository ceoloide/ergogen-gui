import { trackEvent } from './analytics';

describe('trackEvent', () => {
  const originalGtag = window.gtag;

  beforeEach(() => {
    // Reset window.gtag before each test
    window.gtag = jest.fn();
  });

  afterAll(() => {
    // Restore original window.gtag
    window.gtag = originalGtag;
  });

  it('should call window.gtag when it is defined', () => {
    const eventName = 'test_event';
    const eventParams = { param1: 'value1', param2: 123 };

    trackEvent(eventName, eventParams);

    expect(window.gtag).toHaveBeenCalledWith('event', eventName, {
      event_category: 'user_action',
      param1: 'value1',
      param2: 123,
    });
  });

  it('should call window.gtag with default category when eventParams is not provided', () => {
    const eventName = 'test_event';

    trackEvent(eventName);

    expect(window.gtag).toHaveBeenCalledWith('event', eventName, {
      event_category: 'user_action',
    });
  });

  it('should allow overriding event_category', () => {
    const eventName = 'test_event';
    const eventParams = { event_category: 'custom_category' };

    trackEvent(eventName, eventParams);

    expect(window.gtag).toHaveBeenCalledWith('event', eventName, {
      event_category: 'custom_category',
    });
  });

  it('should not throw or call anything when window.gtag is undefined', () => {
    (window as any).gtag = undefined;

    expect(() => trackEvent('test_event')).not.toThrow();
  });
});
