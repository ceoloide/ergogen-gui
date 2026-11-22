import { render, screen, fireEvent } from '@testing-library/react';
import DownloadRow from './DownloadRow';

vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(),
}));

describe('DownloadRow', () => {
  it('removes the temporary anchor element and revokes the Blob URL after downloading', () => {
    const createObjectURL = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:http://localhost/download-1');
    const revokeObjectURL = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    try {
      render(
        <DownloadRow
          fileName="demo"
          extension="svg"
          content="<svg />"
          setPreview={vi.fn()}
          previewKey=""
          data-testid="row"
        />
      );

      fireEvent.click(screen.getByTestId('row-svg-download'));

      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(revokeObjectURL).toHaveBeenCalledWith(
        'blob:http://localhost/download-1'
      );
      expect(document.body.querySelector('a[download="demo.svg"]')).toBeNull();
    } finally {
      createObjectURL.mockRestore();
      revokeObjectURL.mockRestore();
      clickSpy.mockRestore();
    }
  });

  it('cleans up anchor and Blob URL even if anchor click throws', () => {
    const createObjectURL = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:http://localhost/download-err');
    const revokeObjectURL = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {
        throw new Error('blocked download');
      });

    const onError = (e: ErrorEvent) => {
      if (e.message.includes('blocked download')) {
        e.preventDefault();
      }
    };
    window.addEventListener('error', onError);

    try {
      render(
        <DownloadRow
          fileName="broken"
          extension="stl"
          content="solid empty"
          setPreview={vi.fn()}
          previewKey=""
          data-testid="row"
        />
      );

      try {
        fireEvent.click(screen.getByTestId('row-stl-download'));
      } catch {
        // Expected click failure; cleanup must still run
      }
      expect(revokeObjectURL).toHaveBeenCalledWith(
        'blob:http://localhost/download-err'
      );
      expect(
        document.body.querySelector('a[download="broken.stl"]')
      ).toBeNull();
    } finally {
      window.removeEventListener('error', onError);
      createObjectURL.mockRestore();
      revokeObjectURL.mockRestore();
      clickSpy.mockRestore();
    }
  });
});
