# Loading Component

A reusable loading spinner component built with `react-loader-spinner`.

## Installation

The component uses `react-loader-spinner` which is already installed in the project.

## Basic Usage

```jsx
import Loading from '@components/common/Loading'

// Simple loading
<Loading />

// With text
<Loading text="Loading..." />

// Different spinner types
<Loading type="tailspin" />
<Loading type="dots" />
<Loading type="circles" />
```

## Spinner Types

Available types:
- `oval` (default)
- `dots` / `three-dots`
- `tailspin` / `tail-spin`
- `circles`
- `puff`
- `rings`
- `hearts`
- `grid`
- `audio`
- `triangle`
- `bars`
- `revolving` / `revolving-dot`
- `rotating` / `rotating-lines`
- `mutating` / `mutating-dots`
- `watch`
- `color-ring`
- `ball-triangle`

## Sizes

```jsx
// Predefined sizes
<Loading size="small" />   // 40px
<Loading size="medium" />  // 60px (default)
<Loading size="large" />   // 80px

// Custom size
<Loading size={100} />
```

## Colors

```jsx
// Primary color
<Loading color="#6BB9E8" />

// Success color
<Loading color="#8DC63F" />

// With secondary color (for some spinner types)
<Loading type="oval" color="#6BB9E8" secondaryColor="#8DC63F" />
```

## Overlay Mode

Use overlay mode to show loading over existing content:

```jsx
<div style={{ position: 'relative', minHeight: '200px' }}>
  <YourContent />
  {isLoading && (
    <Loading
      overlay
      type="oval"
      text="Loading..."
    />
  )}
</div>

// With blur effect
<Loading overlay blur type="circles" text="Processing..." />

// Dark overlay
<Loading
  overlay
  overlayColor="rgba(0, 0, 0, 0.5)"
  text="Loading..."
  textColor="#fff"
/>
```

## Common Use Cases

### Table Loading State
```jsx
{isLoading ? (
  <Loading type="dots" minHeight="300px" text="Loading data..." />
) : (
  <Table data={data} columns={columns} />
)}
```

### Card Loading
```jsx
<Card>
  <CardHeader title="Dashboard" />
  <CardBody>
    {isLoading ? (
      <Loading type="circles" minHeight="200px" text="Fetching data..." />
    ) : (
      <DashboardContent />
    )}
  </CardBody>
</Card>
```

### Full Page Overlay
```jsx
{isProcessing && (
  <Loading
    overlay
    blur
    type="tailspin"
    size="large"
    text="Processing your request..."
  />
)}
```

### Button Loading State
```jsx
<Button disabled={isLoading}>
  {isLoading ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Loading type="oval" size={20} />
      <span>Loading...</span>
    </div>
  ) : (
    'Submit'
  )}
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | String | `'oval'` | Type of spinner to display |
| `size` | String \| Number | `'medium'` | Size of spinner (small/medium/large or custom number) |
| `color` | String | `'#6BB9E8'` | Primary color of spinner |
| `secondaryColor` | String | `'#8DC63F'` | Secondary color (for some spinner types) |
| `text` | String | - | Text to display below spinner |
| `textSize` | String | `'medium'` | Size of text (small/medium/large) |
| `textColor` | String | `'#6b7280'` | Color of text |
| `textWeight` | String | `'400'` | Font weight of text |
| `overlay` | Boolean | `false` | Show as overlay with background |
| `overlayColor` | String | `'rgba(255,255,255,0.9)'` | Background color for overlay |
| `blur` | Boolean | `false` | Apply backdrop blur (only with overlay) |
| `height` | String | `'auto'` | Container height |
| `minHeight` | String | `'auto'` | Container minimum height |
| `width` | String | `'100%'` | Container width |
| `padding` | String | `'0'` | Container padding |
| `gap` | String | `'1rem'` | Gap between spinner and text |

## Testing

Visit `/uitest` route to see all variants and examples of the Loading component.
