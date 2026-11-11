const callOrder: string[] = [];
let resolveMonaco: (monaco: unknown) => void = () => {};

vi.mock('./utils/analytics', () => ({
  initAnalytics: vi.fn(() => {
    callOrder.push('initAnalytics');
  }),
}));

vi.mock('@monaco-editor/react', () => ({
  loader: {
    init: vi.fn(
      () =>
        new Promise((resolve) => {
          resolveMonaco = resolve;
        })
    ),
  },
}));

vi.mock('./utils/monaco', () => ({
  defineErgogenTheme: vi.fn(),
}));

vi.mock('./App', () => ({
  default: () => null,
}));

vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: unknown }) => children,
}));

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(() => {
      callOrder.push('render');
    }),
  })),
}));

describe('application entry point', () => {
  it('initializes analytics before React renders, so the first page_view is never dropped', async () => {
    // Arrange
    document.body.innerHTML = '<div id="root"></div>';

    // Act
    await import('./index');
    expect(callOrder).toEqual(['initAnalytics']);
    resolveMonaco({});
    await vi.waitFor(() => expect(callOrder).toContain('render'));

    // Assert
    expect(callOrder).toEqual(['initAnalytics', 'render']);
  });
});
