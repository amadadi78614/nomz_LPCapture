import React, { Component, useEffect } from 'react';

export function HardNavigationGuard() {
  useEffect(() => {
    const handleClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest('a[href]');
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;

      event.preventDefault();
      window.location.assign(`${url.pathname}${url.search}${url.hash}`);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return null;
}

export class SiteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[Lowveld Padel] Page render failed', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="page" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <section className="card" style={{ maxWidth: 560, textAlign: 'center', padding: 28 }}>
          <h1 className="display" style={{ marginTop: 0 }}>Page could not load</h1>
          <p className="muted">The site caught a page error instead of leaving you with a blank screen.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ marginTop: 12, padding: '11px 18px', borderRadius: 8, cursor: 'pointer' }}
          >
            Reload page
          </button>
        </section>
      </main>
    );
  }
}
