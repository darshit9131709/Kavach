# Layout Components

Shared layout components extracted from the Stitch-generated HTML page.

## Components

### `LayoutWrapper`
Main wrapper component that includes all layout elements. Use this to wrap your page content.

**Usage:**
```jsx
import LayoutWrapper from '@/components/LayoutWrapper';

export default function DashboardPage() {
  return (
    <LayoutWrapper>
      {/* Your page content here */}
      <div>Dashboard content</div>
    </LayoutWrapper>
  );
}
```

### `Navbar`
Top navigation header with logo, notifications, and profile.

**Features:**
- Sticky header with backdrop blur
- Kavach logo with shield icon
- Notifications button
- User profile image

**Usage:**
```jsx
import Navbar from '@/components/Navbar';

<Navbar />
```

### `BottomNavigation`
Bottom navigation bar with Home, History, Circles, and Settings links.

**Features:**
- Active route highlighting
- Material Symbols icons
- Responsive design
- Integrated with Next.js routing

**Usage:**
```jsx
import BottomNavigation from '@/components/BottomNavigation';

<BottomNavigation />
```

### `SOSButton`
Floating emergency SOS button with press/release handlers.

**Features:**
- Large red circular button
- Animated pulse effect
- Hold-to-activate design
- Accessible with ARIA labels

**Props:**
- `onPress` - Function called when button is pressed
- `onRelease` - Function called when button is released

**Usage:**
```jsx
import SOSButton from '@/components/SOSButton';

<SOSButton 
  onPress={() => console.log('SOS pressed')}
  onRelease={() => console.log('SOS released')}
/>
```

### `BackgroundDecoration`
Decorative background elements with gradient circles.

**Usage:**
```jsx
import BackgroundDecoration from '@/components/BackgroundDecoration';

<BackgroundDecoration />
```

## Color Scheme

The components use the following color palette:
- **Primary**: `#8b47eb` (Purple)
- **Background Light**: `#f7f6f8` (Light gray)
- **Background Dark**: `#181121` (Dark purple)
- **Safety Green**: `#2ecc71` (Green)
- **Emergency Red**: `#ff4d4d` (Red)

## Custom Styles

The following custom CSS classes are available in `globals.css`:
- `.soft-shadow` - Soft purple shadow effect
- `.sos-glow` - Red glow effect for SOS button

## Fonts

- **Display Font**: Public Sans (loaded via Google Fonts)
- **Icons**: Material Symbols Outlined (loaded via Google Fonts)

## Notes

- All components are client components (`'use client'`)
- Components use Next.js Image component for optimized images
- BottomNavigation uses Next.js Link component for routing
- LayoutWrapper includes proper spacing for fixed bottom navigation
