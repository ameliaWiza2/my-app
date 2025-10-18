# Accessibility Guide

## Overview

This application is designed to be fully accessible to users with disabilities, complying with WCAG 2.1 Level AA standards and platform-specific accessibility guidelines.

## Screen Reader Support

### VoiceOver (iOS)

**Testing VoiceOver**:
1. Settings → Accessibility → VoiceOver → On
2. Triple-click home button (or side button on newer devices) to toggle

**Gestures**:
- Swipe right/left: Navigate elements
- Double-tap: Activate element
- Three-finger swipe: Scroll
- Two-finger double-tap: Magic Tap (app-specific action)

### TalkBack (Android)

**Testing TalkBack**:
1. Settings → Accessibility → TalkBack → On
2. Volume keys shortcut for quick toggle

**Gestures**:
- Swipe right/left: Navigate elements
- Double-tap: Activate element
- Two-finger swipe: Scroll
- Local context menu: Swipe up then right

## Implementation Guidelines

### 1. Accessibility Labels

Every interactive element must have a descriptive label:

```tsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Submit form"
  accessibilityHint="Submits the registration form">
  <Text>Submit</Text>
</TouchableOpacity>
```

**Best Practices**:
- Be concise but descriptive
- Avoid redundant phrases like "button" or "image"
- Include current state (e.g., "selected", "expanded")
- Update dynamically when state changes

### 2. Accessibility Roles

Assign semantic roles to elements:

```tsx
<View accessibilityRole="header">
  <Text>Page Title</Text>
</View>

<TouchableOpacity accessibilityRole="button">
  <Text>Click Me</Text>
</TouchableOpacity>

<View accessibilityRole="link">
  <Text>Privacy Policy</Text>
</View>
```

**Available Roles**:
- `button` - Clickable buttons
- `link` - Navigation links
- `header` - Section headers
- `image` - Images
- `imagebutton` - Clickable images
- `text` - Static text
- `alert` - Important messages
- `checkbox` - Checkboxes
- `radio` - Radio buttons
- `switch` - Toggle switches
- `menu` - Menus
- `menubar` - Menu bars
- `menuitem` - Menu items
- `progressbar` - Progress indicators
- `search` - Search fields
- `tab` - Tab buttons
- `tablist` - Tab containers

### 3. Accessibility Hints

Provide hints for non-obvious actions:

```tsx
<TouchableOpacity
  accessibilityLabel="Camera"
  accessibilityHint="Opens camera to take a photo"
  accessibilityRole="button">
  <Icon name="camera" />
</TouchableOpacity>
```

**When to Use Hints**:
- Action isn't obvious from the label
- Complex interactions
- Navigational elements
- Modal triggers

**When NOT to Use Hints**:
- Obvious actions (e.g., "Submit" button)
- Would be redundant with label

### 4. Grouping Related Elements

Group related elements for better navigation:

```tsx
<View
  accessible={true}
  accessibilityLabel="User profile: John Doe, Software Engineer"
  accessibilityRole="summary">
  <Text>John Doe</Text>
  <Text>Software Engineer</Text>
</View>
```

### 5. Form Accessibility

Make forms accessible:

```tsx
<View>
  <Text accessibilityRole="label">Email Address</Text>
  <TextInput
    accessible={true}
    accessibilityLabel="Email address"
    accessibilityHint="Enter your email address"
    placeholder="email@example.com"
    keyboardType="email-address"
    autoComplete="email"
  />
</View>
```

**Best Practices**:
- Label all inputs
- Provide clear error messages
- Announce validation errors
- Support autofill

### 6. State Announcements

Announce state changes:

```tsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel={`Star rating ${rating} out of 5`}
  accessibilityState={{ selected: rating >= 4 }}
  accessibilityRole="button">
  <Text>⭐</Text>
</TouchableOpacity>
```

**Accessibility States**:
- `disabled` - Element is disabled
- `selected` - Element is selected
- `checked` - Checkbox/radio is checked
- `busy` - Loading state
- `expanded` - Accordion/dropdown is expanded

### 7. Focus Management

Manage focus for screen readers:

```tsx
import { AccessibilityInfo, findNodeHandle } from 'react-native';

const inputRef = useRef(null);

const focusInput = () => {
  const handle = findNodeHandle(inputRef.current);
  if (handle) {
    AccessibilityInfo.setAccessibilityFocus(handle);
  }
};

<TextInput ref={inputRef} />
```

### 8. Announcements

Make dynamic announcements:

```tsx
import { AccessibilityInfo } from 'react-native';

const notifyUser = (message: string) => {
  AccessibilityInfo.announceForAccessibility(message);
};

// Usage
notifyUser('Form submitted successfully');
```

## Visual Accessibility

### 1. Color Contrast

**WCAG 2.1 AA Requirements**:
- Normal text (< 18pt): 4.5:1
- Large text (≥ 18pt or ≥ 14pt bold): 3:1
- UI components: 3:1

**Testing Tools**:
- WebAIM Contrast Checker
- Chrome DevTools
- Figma plugins

**Example**:
```tsx
const styles = StyleSheet.create({
  // Good: High contrast
  text: {
    color: '#000000',      // Black text
    backgroundColor: '#FFFFFF',  // White background
    // Contrast ratio: 21:1
  },
  
  // Bad: Low contrast
  // textBad: {
  //   color: '#CCCCCC',    // Light gray text
  //   backgroundColor: '#FFFFFF',  // White background
  //   Contrast ratio: 1.6:1 (fails WCAG AA)
  // },
});
```

### 2. Font Sizes

Support dynamic type:

```tsx
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  text: {
    fontSize: Platform.select({
      ios: 17,      // Default iOS font size
      android: 14,  // Default Android font size
    }),
    // Respect user's font size preferences
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'Roboto' },
    }),
  },
});
```

**Minimum Font Sizes**:
- Body text: 16px/dp (minimum)
- Small text: 14px/dp (minimum)
- Large text: 20px/dp or larger

### 3. Touch Targets

**Minimum Sizes**:
- iOS: 44x44 points
- Android: 48x48 dp

```tsx
const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

**Spacing**:
- Minimum 8px/dp between touch targets
- Prefer 16px/dp for better usability

### 4. Color Independence

Never rely solely on color to convey information:

```tsx
// Good: Uses icon + color
<View>
  <Icon name="check" color="green" />
  <Text>Success</Text>
</View>

// Bad: Color only
// <View style={{ backgroundColor: 'green' }}>
//   <Text>Success</Text>
// </View>
```

## Motion and Animation

### Reduced Motion

Respect reduced motion preferences:

```tsx
import { AccessibilityInfo } from 'react-native';
import { useEffect, useState } from 'react';

const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReducedMotion
    );

    return () => subscription.remove();
  }, []);

  return reducedMotion;
};

// Usage
const MyComponent = () => {
  const reducedMotion = useReducedMotion();

  return (
    <Animated.View
      style={{
        transform: [{
          translateY: reducedMotion ? 0 : animatedValue
        }]
      }}
    />
  );
};
```

### Animation Guidelines

- Keep animations under 200ms
- Provide skip/pause controls for long animations
- Avoid flashing content (no more than 3 flashes per second)

## Keyboard Navigation

### Focus Order

Ensure logical focus order:

```tsx
<View>
  <TextInput tabIndex={1} />
  <TextInput tabIndex={2} />
  <TouchableOpacity tabIndex={3}>
    <Text>Submit</Text>
  </TouchableOpacity>
</View>
```

### Keyboard Shortcuts

Document keyboard shortcuts:

```tsx
<View
  accessibilityLabel="Delete item"
  accessibilityHint="Press command + delete to remove">
  <Text>Delete</Text>
</View>
```

## Testing Checklist

### Automated Testing

- [ ] All interactive elements have accessibility labels
- [ ] Roles assigned correctly
- [ ] State changes announced
- [ ] Color contrast validated
- [ ] Touch targets meet minimum sizes

### Manual Testing

#### VoiceOver (iOS)

- [ ] Navigate through all screens
- [ ] Verify labels are descriptive
- [ ] Test form submission
- [ ] Verify announcements work
- [ ] Test modal dismissal
- [ ] Verify rotor functionality

#### TalkBack (Android)

- [ ] Navigate through all screens
- [ ] Verify labels are descriptive
- [ ] Test form submission
- [ ] Verify announcements work
- [ ] Test modal dismissal
- [ ] Verify local context menu

### Additional Tests

- [ ] Test with increased font size
- [ ] Test with reduced motion enabled
- [ ] Test with inverted colors
- [ ] Test with grayscale mode
- [ ] Test keyboard navigation
- [ ] Test with voice control

## Platform-Specific Guidelines

### iOS

**Resources**:
- [Human Interface Guidelines - Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [UIKit Accessibility Programming Guide](https://developer.apple.com/documentation/uikit/accessibility)

**Features**:
- VoiceOver
- Voice Control
- Switch Control
- Dynamic Type
- Reduce Motion
- Increase Contrast
- Differentiate Without Color

### Android

**Resources**:
- [Material Design - Accessibility](https://material.io/design/usability/accessibility.html)
- [Android Accessibility Guide](https://developer.android.com/guide/topics/ui/accessibility)

**Features**:
- TalkBack
- Voice Access
- Switch Access
- Font Size
- Display Size
- Remove Animations

## Common Patterns

### Modal Dialogs

```tsx
<Modal
  visible={visible}
  onRequestClose={onClose}
  accessible={true}
  accessibilityViewIsModal={true}
  accessibilityLabel="Confirmation dialog"
  accessibilityRole="alert">
  <View>
    <Text accessibilityRole="header">Confirm Action</Text>
    <Text>Are you sure?</Text>
    <TouchableOpacity
      accessibilityLabel="Confirm"
      accessibilityRole="button">
      <Text>Yes</Text>
    </TouchableOpacity>
    <TouchableOpacity
      accessibilityLabel="Cancel"
      accessibilityRole="button">
      <Text>No</Text>
    </TouchableOpacity>
  </View>
</Modal>
```

### Lists

```tsx
<FlatList
  data={items}
  accessible={false}  // Don't make list accessible
  renderItem={({ item }) => (
    <TouchableOpacity
      accessible={true}  // Make items accessible
      accessibilityLabel={`${item.title}, ${item.description}`}
      accessibilityRole="button">
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>
    </TouchableOpacity>
  )}
/>
```

### Images

```tsx
// Decorative image
<Image
  source={require('./decoration.png')}
  accessible={false}
/>

// Informative image
<Image
  source={require('./chart.png')}
  accessible={true}
  accessibilityLabel="Sales chart showing 20% increase"
  accessibilityRole="image"
/>
```

## Resources

### Tools

- **iOS**: Accessibility Inspector (Xcode)
- **Android**: Accessibility Scanner
- **Web**: axe DevTools, WAVE
- **Color**: Contrast Checker, Colorblind Simulator

### Testing Services

- **Automated**: Pa11y, axe-core
- **Manual**: UsabilityHub, UserTesting
- **Professional**: Accessibility audits by certified experts

### Learning Resources

- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)

## Support

For accessibility questions or issues:
- Email: accessibility@example.com
- Documentation: [Internal Wiki]
- Slack: #accessibility

## Updates

Review and update this guide quarterly to reflect new patterns and platform changes.

**Last Updated**: October 2024
