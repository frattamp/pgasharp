export default function Terms({ onClose }) {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--heading)', letterSpacing: -0.5 }}>Terms of Service</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Last updated: April 1, 2026</div>
        </div>
      </div>

      {[
        ['1. Acceptance of Terms', 'By accessing or using PGASharp ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.'],
        ['2. Description of Service', 'PGASharp provides real-time golf data, DFS analytics tools, and related content for informational and entertainment purposes. Data is sourced from third-party providers including DataGolf. We do not guarantee the accuracy, completeness, or timeliness of any data.'],
        ['3. No Guarantee of Results', 'PGASharp is a research tool to assist with DFS decisions. We make no guarantees about winnings or outcomes. You are solely responsible for your own DFS decisions and any financial results.'],
        ['4. Subscription and Payments', 'PGASharp offers paid subscription plans. Payments are processed securely through Stripe. Subscriptions auto-renew unless cancelled. You may cancel at any time. Refunds are not provided for partial billing periods.'],
        ['5. Intellectual Property', 'All content, design, and code on PGASharp is the property of PGASharp Inc.. You may not reproduce, distribute, or create derivative works without written permission.'],
        ['6. Limitation of Liability', 'PGASharp and its owners shall not be liable for any direct, indirect, incidental, or consequential damages arising from use of the Service. The Service is provided "as is" without warranty of any kind.'],
        ['7. Changes to Terms', 'We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.'],
        ['8. Contact', 'For questions about these terms, contact us at info@pgasharp.com'],
      ].map(([title, body]) => (
        <div key={title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--heading)', marginBottom: 8 }}>{title}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{body}</div>
        </div>
      ))}

      <div style={{ marginTop: 24, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
        © 2026 PGASharp. All rights reserved.
      </div>
    </div>
  )
}