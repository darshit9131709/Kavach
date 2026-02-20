'use client';

// Backwards-compatible wrapper around TrustedContactsSection.
// Prefer importing TrustedContactsSection directly for new code.
import TrustedContactsSection from './TrustedContactsSection';

export default function TrustedContacts(props) {
  return <TrustedContactsSection {...props} />;
}

