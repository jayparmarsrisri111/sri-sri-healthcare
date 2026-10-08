import React from 'react';

/**
 * Global React Error Boundary for Sri Sri HealthCare
 * Ensures zero-freeze, zero-white-screen stability on budget Android, iOS, tablets, and low-RAM devices.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🛡️ Sri Sri HealthCare Error Boundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHardReset = () => {
    try {
      sessionStorage.clear();
      // Keep essential tokens if needed or reload clean
      window.location.href = window.location.origin;
    } catch (e) {
      window.location.reload();
    }
  };

  handleDismiss = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A1128 0%, #001F54 100%)',
          color: '#FFFFFF',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(0, 196, 140, 0.4)',
            borderRadius: '24px',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(0, 196, 140, 0.15)',
              border: '2px solid #00C48C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 18px auto'
            }}>
              ❤️
            </div>

            <div style={{
              display: 'inline-block',
              background: '#00C48C',
              color: '#0A1128',
              fontSize: '11px',
              fontWeight: 900,
              padding: '4px 12px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px'
            }}>
              શ્રી શ્રી હેલ્થકેર • સેફ રિકવરી મોડ
            </div>

            <h1 style={{
              fontSize: '22px',
              fontWeight: 900,
              margin: '0 0 10px 0',
              lineHeight: 1.3
            }}>
              એપ્લિકેશન સુરક્ષિત રીતે પુનઃપ્રારંભ કરો
            </h1>

            <p style={{
              fontSize: '14px',
              color: '#D3F2E3',
              margin: '0 0 24px 0',
              lineHeight: 1.6
            }}>
              તમારા ફોન અથવા બ્રાઉઝરમાં કોઈ ટેમ્પરરી ભૂલ કે મેમરી લોડ થવાથી સ્ક્રીન અટકી ન જાય તે માટે આ સેફ પ્રોટેક્શન રાખેલ છે. નીચેના બટન પર ક્લિક કરીને સરળતાથી આગળ વધો:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={this.handleReload}
                style={{
                  background: 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0, 196, 140, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                🔄 એપ્લિકેશન ફરીથી લોડ કરો (Reload App)
              </button>

              <button
                onClick={this.handleDismiss}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                🏠 સામાન્ય સ્ક્રીન પર પાછા ફરો (Dismiss & Continue)
              </button>

              <button
                onClick={this.handleHardReset}
                style={{
                  background: 'transparent',
                  color: '#94A3B8',
                  border: 'none',
                  padding: '8px 12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                🧹 કેશ સાફ કરી નવી શરૂઆત કરો (Clear Cache & Reset)
              </button>
            </div>

            {this.state.error && (
              <details style={{
                marginTop: '20px',
                textAlign: 'left',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '11px',
                color: '#CBD5E1'
              }}>
                <summary style={{ cursor: 'pointer', color: '#94A3B8', fontWeight: 600 }}>
                  ટેકનિકલ વિગત જુઓ (Technical Error Info)
                </summary>
                <pre style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
