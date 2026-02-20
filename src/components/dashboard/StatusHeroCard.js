'use client';

// Backwards-compatible wrapper around StatusCard.
// Prefer importing StatusCard directly for new code.
import StatusCard from './StatusCard';

export default function StatusHeroCard(props) {
  return <StatusCard {...props} />;
}

