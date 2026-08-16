import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-light)',
      padding: '40px 24px 30px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <BrandLogo size="small" showSubtitle={true} />

          <div style={{
            display: 'flex',
            gap: '20px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            flexWrap: 'wrap'
          }}>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Cancellation & Refund Policy</span>
            <span>Help Center</span>
            <span>Safety & Security</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="#10b981" /> 256-Bit SSL Encrypted Ticketing Platform
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} Cineloom Cinema Networks Inc. All rights reserved.
          </div>
          <div>
            Built with pure React & Vanilla CSS for high performance cinema ticketing.
          </div>
        </div>
      </div>
    </footer>
  );
}
