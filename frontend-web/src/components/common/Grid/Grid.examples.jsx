/**
 * Grid System Examples
 *
 * This file demonstrates how to use the Bootstrap-like Grid system
 * with Container, Row, and Col components.
 */

import { Container, Row, Col } from './index'

// ============================================
// EXAMPLE 1: Basic Equal Width Columns
// ============================================
function Example1() {
  return (
    <Container>
      <Row>
        <Col>Column 1</Col>
        <Col>Column 2</Col>
        <Col>Column 3</Col>
      </Row>
    </Container>
  )
}

// ============================================
// EXAMPLE 2: Specific Column Widths (12-column grid)
// ============================================
function Example2() {
  return (
    <Container>
      <Row>
        <Col xs={8}>8 columns wide</Col>
        <Col xs={4}>4 columns wide</Col>
      </Row>
      <Row>
        <Col xs={6}>6 columns wide</Col>
        <Col xs={6}>6 columns wide</Col>
      </Row>
      <Row>
        <Col xs={4}>4 columns</Col>
        <Col xs={4}>4 columns</Col>
        <Col xs={4}>4 columns</Col>
      </Row>
    </Container>
  )
}

// ============================================
// EXAMPLE 3: Responsive Columns
// ============================================
function Example3() {
  return (
    <Container>
      <Row>
        {/* Full width on mobile, half on tablet, third on desktop */}
        <Col xs={12} md={6} lg={4}>
          Responsive Column 1
        </Col>
        <Col xs={12} md={6} lg={4}>
          Responsive Column 2
        </Col>
        <Col xs={12} md={6} lg={4}>
          Responsive Column 3
        </Col>
      </Row>
    </Container>
  )
}

// ============================================
// EXAMPLE 4: Auto-width Columns
// ============================================
function Example4() {
  return (
    <Container>
      <Row>
        <Col xs="auto">Auto width content</Col>
        <Col>Flexible column fills remaining space</Col>
        <Col xs="auto">Another auto width</Col>
      </Row>
    </Container>
  )
}

// ============================================
// EXAMPLE 5: With Custom Gap
// ============================================
function Example5() {
  return (
    <Container>
      <Row gap="2rem">
        <Col xs={12} md={4}>Column 1</Col>
        <Col xs={12} md={4}>Column 2</Col>
        <Col xs={12} md={4}>Column 3</Col>
      </Row>
    </Container>
  )
}

// ============================================
// EXAMPLE 6: Alignment
// ============================================
function Example6() {
  return (
    <Container>
      {/* Vertical alignment */}
      <Row alignItems="center" style={{ minHeight: '200px' }}>
        <Col xs={4}>Centered vertically</Col>
        <Col xs={4}>Centered vertically</Col>
        <Col xs={4}>Centered vertically</Col>
      </Row>

      {/* Horizontal alignment */}
      <Row justifyContent="center">
        <Col xs={6}>Centered horizontally</Col>
      </Row>

      <Row justifyContent="space-between">
        <Col xs={4}>Left</Col>
        <Col xs={4}>Right</Col>
      </Row>
    </Container>
  )
}

// ============================================
// EXAMPLE 7: Column Offset
// ============================================
function Example7() {
  return (
    <Container>
      <Row>
        <Col xs={4}>Normal column</Col>
        <Col xs={4} offset={4}>Offset by 4 columns</Col>
      </Row>
      <Row>
        <Col xs={6} offset={3}>Centered with offset</Col>
      </Row>
    </Container>
  )
}

// ============================================
// EXAMPLE 8: Column Ordering
// ============================================
function Example8() {
  return (
    <Container>
      <Row>
        <Col xs={4} order={3}>First in DOM, third visually</Col>
        <Col xs={4} order={1}>Second in DOM, first visually</Col>
        <Col xs={4} order={2}>Third in DOM, second visually</Col>
      </Row>
    </Container>
  )
}

// ============================================
// EXAMPLE 9: No Gutters
// ============================================
function Example9() {
  return (
    <Container>
      <Row noGutters>
        <Col xs={6}>No gutter left</Col>
        <Col xs={6}>No gutter right</Col>
      </Row>
    </Container>
  )
}

// ============================================
// EXAMPLE 10: Fluid Container
// ============================================
function Example10() {
  return (
    <Container fluid>
      <Row>
        <Col xs={12}>Full width container spanning entire viewport</Col>
      </Row>
    </Container>
  )
}

// ============================================
// EXAMPLE 11: Form Layout
// ============================================
function Example11() {
  return (
    <Container>
      <Row gap="1rem">
        <Col xs={12} md={6}>
          <label>First Name</label>
          <input type="text" style={{ width: '100%' }} />
        </Col>
        <Col xs={12} md={6}>
          <label>Last Name</label>
          <input type="text" style={{ width: '100%' }} />
        </Col>
        <Col xs={12}>
          <label>Email</label>
          <input type="email" style={{ width: '100%' }} />
        </Col>
        <Col xs={12} md={4}>
          <label>City</label>
          <input type="text" style={{ width: '100%' }} />
        </Col>
        <Col xs={12} md={4}>
          <label>State</label>
          <input type="text" style={{ width: '100%' }} />
        </Col>
        <Col xs={12} md={4}>
          <label>Zip</label>
          <input type="text" style={{ width: '100%' }} />
        </Col>
      </Row>
    </Container>
  )
}

// ============================================
// EXAMPLE 12: Card Grid
// ============================================
function Example12() {
  return (
    <Container>
      <Row gap="1.5rem">
        {[1, 2, 3, 4, 5, 6].map(num => (
          <Col key={num} xs={12} sm={6} lg={4}>
            <div style={{
              padding: '1.5rem',
              background: 'var(--color-gray-50)',
              borderRadius: '8px',
              border: '1px solid var(--color-gray-200)'
            }}>
              <h3>Card {num}</h3>
              <p>Card content goes here</p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

// ============================================
// EXAMPLE 13: Nested Rows
// ============================================
function Example13() {
  return (
    <Container>
      <Row>
        <Col xs={12} lg={8}>
          <h2>Main Content</h2>
          <Row gap="1rem">
            <Col xs={6}>Nested 1</Col>
            <Col xs={6}>Nested 2</Col>
          </Row>
        </Col>
        <Col xs={12} lg={4}>
          <h2>Sidebar</h2>
          <p>Sidebar content</p>
        </Col>
      </Row>
    </Container>
  )
}

export default {
  Example1,
  Example2,
  Example3,
  Example4,
  Example5,
  Example6,
  Example7,
  Example8,
  Example9,
  Example10,
  Example11,
  Example12,
  Example13
}
