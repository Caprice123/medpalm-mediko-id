import { useState } from 'react'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import CurrencyInput from '@components/common/CurrencyInput'
import Textarea from '@components/common/Textarea'
import Table from '@components/common/Table'
import FileUpload from '@components/common/FileUpload'
import Loading from '@components/common/Loading'
import { Card, CardHeader, CardBody, CardFooter } from '@components/common/Card'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import {
  Container,
  Header,
  Title,
  Subtitle,
  Section,
  SectionTitle,
  ComponentGrid,
  ComponentCard,
  ComponentLabel,
  ComponentDemo,
  StateLabel,
  ButtonGroup,
  Badge,
  ColorPalette,
  ColorSwatch
} from './UITest.styles'

function UITest() {
  const [selectedDropdown, setSelectedDropdown] = useState(null)
  const [selectedMulti, setSelectedMulti] = useState({ value: 'option1', label: 'Option 1' })

  // Form input states
  const [textValue, setTextValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [currencyValue, setCurrencyValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')

  // File upload states
  const [pdfFile, setPdfFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [documentFile, setDocumentFile] = useState(null)
  const [uploadedWithActions, setUploadedWithActions] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // File upload handlers
  const handlePdfSelect = (e) => {
    const file = e.target?.files?.[0] || e
    if (file) {
      setPdfFile({
        name: file.name,
        type: file.type,
        size: file.size
      })
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target?.files?.[0] || e
    if (file) {
      setImageFile({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file) // For preview
      })
    }
  }

  const handleDocumentSelect = (e) => {
    const file = e.target?.files?.[0] || e
    if (file) {
      setIsUploading(true)
      // Simulate upload
      setTimeout(() => {
        setDocumentFile({
          name: file.name,
          type: file.type,
          size: file.size
        })
        setIsUploading(false)
      }, 1500)
    }
  }

  const handleActionFileSelect = (e) => {
    const file = e.target?.files?.[0] || e
    if (file) {
      setUploadedWithActions({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      })
    }
  }

  // Table data
  const tableColumns = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', align: 'center' },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : 'error'}>
          {value}
        </Badge>
      )
    }
  ]

  const tableData = [
    { id: 1, name: 'Ahmad Rizki', email: 'ahmad@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Siti Permata', email: 'siti@example.com', role: 'User', status: 'active' },
    { id: 3, name: 'Budi Wijaya', email: 'budi@example.com', role: 'User', status: 'inactive' },
    { id: 4, name: 'Dewi Sartika', email: 'dewi@example.com', role: 'Editor', status: 'active' },
    { id: 5, name: 'Eko Prasetyo', email: 'eko@example.com', role: 'User', status: 'active' }
  ]

  const dropdownOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' }
  ]

  return (
    <Container>
      <Header>
        <Title>UI Component Testing</Title>
        <Subtitle>Test and preview all UI components in different states</Subtitle>
      </Header>

      {/* Dropdowns Section */}
      <Section>
        <SectionTitle>Dropdowns</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentLabel>Normal State</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Default</StateLabel>
              <Dropdown
                options={dropdownOptions}
                value={selectedDropdown}
                onChange={setSelectedDropdown}
                placeholder="Select an option"
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>With Value</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Selected value</StateLabel>
              <Dropdown
                options={dropdownOptions}
                value={selectedMulti}
                onChange={setSelectedMulti}
                placeholder="Select an option"
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Error State</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Has error</StateLabel>
              <Dropdown
                options={dropdownOptions}
                value={null}
                onChange={() => {}}
                placeholder="Select an option"
                hasError={true}
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Disabled State</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Disabled</StateLabel>
              <Dropdown
                options={dropdownOptions}
                value={{ value: 'option1', label: 'Option 1' }}
                onChange={() => {}}
                placeholder="Select an option"
                disabled={true}
              />
            </ComponentDemo>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Buttons Section */}
      <Section>
        <SectionTitle>Buttons</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentLabel>Button Variants</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Primary</StateLabel>
              <ButtonGroup>
                <Button variant="primary">Primary</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </ButtonGroup>
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Secondary</StateLabel>
              <ButtonGroup>
                <Button variant="secondary">Secondary</Button>
                <Button variant="secondary" disabled>Disabled</Button>
              </ButtonGroup>
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Danger</StateLabel>
              <ButtonGroup>
                <Button variant="danger">Danger</Button>
                <Button variant="danger" disabled>Disabled</Button>
              </ButtonGroup>
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Success</StateLabel>
              <ButtonGroup>
                <Button variant="success">Success</Button>
                <Button variant="success" disabled>Disabled</Button>
              </ButtonGroup>
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Outline</StateLabel>
              <ButtonGroup>
                <Button variant="outline">Outline</Button>
                <Button variant="outline" disabled>Disabled</Button>
              </ButtonGroup>
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Button Sizes</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Sizes</StateLabel>
              <ButtonGroup>
                <Button variant="primary" size="small">Small</Button>
                <Button variant="primary" size="medium">Medium</Button>
                <Button variant="primary" size="large">Large</Button>
              </ButtonGroup>
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Full Width</StateLabel>
              <Button variant="primary" fullWidth>Full Width Button</Button>
            </ComponentDemo>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Form Inputs Section */}
      <Section>
        <SectionTitle>Form Inputs</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentLabel>Text Input</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Normal with Label</StateLabel>
              <TextInput
                label="Full Name"
                placeholder="Enter your name..."
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Required</StateLabel>
              <TextInput
                label="Email Address"
                required
                type="email"
                placeholder="Enter your email..."
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                hint="We'll never share your email"
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Error State</StateLabel>
              <TextInput
                label="Username"
                placeholder="Enter username..."
                error="Username is already taken"
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Disabled</StateLabel>
              <TextInput
                label="Disabled Field"
                placeholder="Cannot edit..."
                disabled
                value="Disabled value"
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Password Input</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Password Field</StateLabel>
              <TextInput
                label="Password"
                required
                type="password"
                placeholder="Enter password..."
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                hint="Minimum 8 characters"
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Currency Input</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Normal</StateLabel>
              <CurrencyInput
                label="Price"
                placeholder="0"
                value={currencyValue}
                onChange={(e) => setCurrencyValue(e.target.value)}
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Required with Hint</StateLabel>
              <CurrencyInput
                label="Amount"
                required
                placeholder="0"
                hint="Enter amount in Indonesian Rupiah"
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Error State</StateLabel>
              <CurrencyInput
                label="Budget"
                placeholder="0"
                error="Amount must be greater than 0"
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Disabled</StateLabel>
              <CurrencyInput
                label="Total"
                placeholder="0"
                disabled
                value="100000"
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Textarea</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Normal</StateLabel>
              <Textarea
                label="Description"
                placeholder="Enter description..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                rows={3}
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>With Character Count</StateLabel>
              <Textarea
                label="Bio"
                required
                placeholder="Tell us about yourself..."
                maxLength={200}
                showCharCount
                hint="Maximum 200 characters"
                rows={4}
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Error State</StateLabel>
              <Textarea
                label="Comments"
                placeholder="Enter comments..."
                error="This field is required"
                rows={3}
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Disabled</StateLabel>
              <Textarea
                label="Notes"
                placeholder="Cannot edit..."
                disabled
                value="This textarea is disabled"
                rows={3}
              />
            </ComponentDemo>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* File Upload Section */}
      <Section>
        <SectionTitle>File Upload</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentLabel>Basic PDF Upload</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Simple upload without actions</StateLabel>
              <FileUpload
                file={pdfFile}
                onFileSelect={handlePdfSelect}
                onRemove={() => setPdfFile(null)}
                acceptedTypes={['application/pdf']}
                acceptedTypesLabel="PDF file"
                maxSizeMB={20}
                uploadText="Click to upload PDF"
                actions={<></>}
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Code Example</StateLabel>
              <pre style={{
                background: '#f9fafb',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                overflow: 'auto'
              }}>
{`<FileUpload
  file={pdfFile}
  onFileSelect={handlePdfSelect}
  onRemove={() => setPdfFile(null)}
  acceptedTypes={['application/pdf']}
  acceptedTypesLabel="PDF file"
  maxSizeMB={20}
  uploadText="Click to upload PDF"
  actions={<></>}
/>`}
              </pre>
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Document Upload with Loading</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Shows loading state during upload</StateLabel>
              <FileUpload
                file={documentFile}
                onFileSelect={handleDocumentSelect}
                onRemove={() => setDocumentFile(null)}
                isUploading={isUploading}
                acceptedTypes={['.pdf', '.pptx', '.docx']}
                acceptedTypesLabel="PDF, PPTX, DOCX"
                maxSizeMB={50}
                uploadText="Upload document"
                actions={<></>}
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Code Example</StateLabel>
              <pre style={{
                background: '#f9fafb',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                overflow: 'auto'
              }}>
{`<FileUpload
  file={documentFile}
  onFileSelect={handleDocumentSelect}
  onRemove={() => setDocumentFile(null)}
  isUploading={isUploading}
  acceptedTypes={['.pdf', '.pptx', '.docx']}
  acceptedTypesLabel="PDF, PPTX, DOCX"
  maxSizeMB={50}
  uploadText="Upload document"
  actions={<></>}
/>`}
              </pre>
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Image Upload with Preview</ComponentLabel>
            <ComponentDemo>
              <StateLabel>With PhotoView integration</StateLabel>
              <PhotoProvider>
                <FileUpload
                  file={imageFile}
                  onFileSelect={handleImageSelect}
                  onRemove={() => setImageFile(null)}
                  acceptedTypes={['image/jpeg', 'image/jpg', 'image/png']}
                  acceptedTypesLabel="JPEG, PNG"
                  maxSizeMB={5}
                  uploadText="Upload image"
                  actions={
                    <>
                      {imageFile?.url && (
                        <PhotoView src={imageFile.url}>
                          <Button size="small" variant="primary">
                            👁️ Preview
                          </Button>
                        </PhotoView>
                      )}
                    </>
                  }
                />
              </PhotoProvider>
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Code Example</StateLabel>
              <pre style={{
                background: '#f9fafb',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                overflow: 'auto'
              }}>
{`<PhotoProvider>
  <FileUpload
    file={imageFile}
    onFileSelect={handleImageSelect}
    onRemove={() => setImageFile(null)}
    acceptedTypes={['image/jpeg', 'image/jpg', 'image/png']}
    acceptedTypesLabel="JPEG, PNG"
    maxSizeMB={5}
    uploadText="Upload image"
    actions={
      <>
        {imageFile?.url && (
          <PhotoView src={imageFile.url}>
            <Button size="small">👁️ Preview</Button>
          </PhotoView>
        )}
      </>
    }
  />
</PhotoProvider>`}
              </pre>
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Upload with Custom Actions</ComponentLabel>
            <ComponentDemo>
              <StateLabel>View and Generate buttons</StateLabel>
              <FileUpload
                file={uploadedWithActions}
                onFileSelect={handleActionFileSelect}
                onRemove={() => setUploadedWithActions(null)}
                acceptedTypes={['.pdf']}
                acceptedTypesLabel="PDF file"
                maxSizeMB={20}
                uploadText="Upload for generation"
                actions={
                  <>
                    {uploadedWithActions?.url && (
                      <Button
                        as="a"
                        href={uploadedWithActions.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        variant="secondary"
                      >
                        View
                      </Button>
                    )}
                    {uploadedWithActions && (
                      <Button
                        size="small"
                        variant="success"
                        onClick={() => alert('Generate triggered!')}
                      >
                        ✨ Generate
                      </Button>
                    )}
                  </>
                }
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Code Example</StateLabel>
              <pre style={{
                background: '#f9fafb',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                overflow: 'auto'
              }}>
{`<FileUpload
  file={uploadedWithActions}
  onFileSelect={handleActionFileSelect}
  onRemove={() => setUploadedWithActions(null)}
  acceptedTypes={['.pdf']}
  acceptedTypesLabel="PDF file"
  maxSizeMB={20}
  uploadText="Upload for generation"
  actions={
    <>
      {uploadedWithActions?.url && (
        <Button
          as="a"
          href={uploadedWithActions.url}
          target="_blank"
          size="small"
        >
          View
        </Button>
      )}
      {uploadedWithActions && (
        <Button
          size="small"
          variant="success"
          onClick={() => alert('Generate!')}
        >
          ✨ Generate
        </Button>
      )}
    </>
  }
/>`}
              </pre>
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard style={{ gridColumn: '1 / -1' }}>
            <ComponentLabel>Component Props Documentation</ComponentLabel>
            <ComponentDemo>
              <div style={{
                background: '#f9fafb',
                padding: '1.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#111827' }}>
                  FileUpload Component Props
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Prop</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Required</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>file</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        Object | null
                      </td>
                      <td style={{ padding: '0.5rem' }}>No</td>
                      <td style={{ padding: '0.5rem' }}>
                        File object with name, type, size properties
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>onFileSelect</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>Function</td>
                      <td style={{ padding: '0.5rem' }}>Yes</td>
                      <td style={{ padding: '0.5rem' }}>Callback when file is selected</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>onRemove</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>Function</td>
                      <td style={{ padding: '0.5rem' }}>No</td>
                      <td style={{ padding: '0.5rem' }}>Callback to remove file</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>actions</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>ReactNode</td>
                      <td style={{ padding: '0.5rem' }}>No</td>
                      <td style={{ padding: '0.5rem' }}>Custom action buttons (View, Generate, etc.)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>acceptedTypes</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>Array</td>
                      <td style={{ padding: '0.5rem' }}>No</td>
                      <td style={{ padding: '0.5rem' }}>Array of accepted file types/extensions</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>acceptedTypesLabel</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>No</td>
                      <td style={{ padding: '0.5rem' }}>Label for accepted types (e.g., "PDF, PPTX")</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>maxSizeMB</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>Number</td>
                      <td style={{ padding: '0.5rem' }}>No</td>
                      <td style={{ padding: '0.5rem' }}>Maximum file size in MB (default: 50)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>isUploading</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>Boolean</td>
                      <td style={{ padding: '0.5rem' }}>No</td>
                      <td style={{ padding: '0.5rem' }}>Upload loading state (default: false)</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>uploadText</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>No</td>
                      <td style={{ padding: '0.5rem' }}>Custom upload area text</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                  <strong style={{ color: '#1e40af' }}>💡 Usage Tips:</strong>
                  <ul style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.5rem', color: '#1e3a8a' }}>
                    <li>Pass action buttons as React components in the <code>actions</code> prop</li>
                    <li>Use PhotoProvider wrapper for image preview functionality</li>
                    <li>The component handles file size formatting and icons automatically</li>
                    <li>Used across: Summary Notes, Flashcards, Exercises, MCQ, Anatomy Quiz</li>
                  </ul>
                </div>
              </div>
            </ComponentDemo>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Card Component Section */}
      <Section>
        <SectionTitle>Card Component</SectionTitle>
        <ComponentGrid>
          {/* Basic Card */}
          <ComponentCard style={{ gridColumn: '1 / -1' }}>
            <ComponentLabel>Basic Card with Header, Body, Footer</ComponentLabel>
            <ComponentDemo>
              <Card>
                <CardHeader
                  title="Card Title"
                  actions={
                    <>
                      <Button size="sm" variant="ghost">Action 1</Button>
                      <Button size="sm" variant="primary">Action 2</Button>
                    </>
                  }
                />
                <CardBody>
                  <p style={{ margin: 0 }}>
                    This is the card body. It can contain any content like text, images, forms, or other components.
                  </p>
                </CardBody>
                <CardFooter align="right">
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="primary">Save</Button>
                </CardFooter>
              </Card>

              <div style={{
                marginTop: '1rem',
                background: '#1f2937',
                color: '#e5e7eb',
                padding: '1rem',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap'
              }}>
{`<Card>
  <CardHeader
    title="Card Title"
    actions={
      <>
        <Button size="sm" variant="ghost">Action 1</Button>
        <Button size="sm" variant="primary">Action 2</Button>
      </>
    }
  />
  <CardBody>
    <p>Card content goes here...</p>
  </CardBody>
  <CardFooter align="right">
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>`}
              </div>
            </ComponentDemo>
          </ComponentCard>

          {/* Card Variants */}
          <ComponentCard style={{ gridColumn: '1 / -1' }}>
            <ComponentLabel>Card Variants</ComponentLabel>
            <ComponentDemo>
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                <Card variant="primary">
                  <CardHeader title="Primary Card" divider={true} />
                  <CardBody>
                    <p style={{ margin: 0 }}>Blue variant - great for highlighting important information or primary actions.</p>
                  </CardBody>
                </Card>

                <Card variant="success">
                  <CardHeader title="Success Card" divider={true} />
                  <CardBody>
                    <p style={{ margin: 0 }}>Green variant - perfect for success messages or completed states.</p>
                  </CardBody>
                </Card>

                <Card variant="warning">
                  <CardHeader title="Warning Card" divider={true} />
                  <CardBody>
                    <p style={{ margin: 0 }}>Yellow variant - ideal for warnings or important notices.</p>
                  </CardBody>
                </Card>

                <Card variant="danger">
                  <CardHeader title="Danger Card" divider={true} />
                  <CardBody>
                    <p style={{ margin: 0 }}>Red variant - use for errors or destructive actions.</p>
                  </CardBody>
                </Card>
              </div>

              <div style={{
                marginTop: '1rem',
                background: '#1f2937',
                color: '#e5e7eb',
                padding: '1rem',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
{`<Card variant="primary">...</Card>
<Card variant="success">...</Card>
<Card variant="warning">...</Card>
<Card variant="danger">...</Card>`}
              </div>
            </ComponentDemo>
          </ComponentCard>

          {/* Footer Alignment Options */}
          <ComponentCard style={{ gridColumn: '1 / -1' }}>
            <ComponentLabel>Footer Alignment Options</ComponentLabel>
            <ComponentDemo>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <Card>
                  <CardHeader title="Left Aligned Footer" />
                  <CardBody>
                    <p style={{ margin: 0 }}>Footer actions aligned to the left.</p>
                  </CardBody>
                  <CardFooter align="left">
                    <Button variant="primary">Left Action</Button>
                    <Button variant="ghost">Secondary</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader title="Center Aligned Footer" />
                  <CardBody>
                    <p style={{ margin: 0 }}>Footer actions centered.</p>
                  </CardBody>
                  <CardFooter align="center">
                    <Button variant="primary">Center Action</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader title="Space Between Footer" />
                  <CardBody>
                    <p style={{ margin: 0 }}>Footer actions with space between.</p>
                  </CardBody>
                  <CardFooter align="between">
                    <Button variant="ghost">Kembali</Button>
                    <Button variant="primary">Next</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader title="Right Aligned Footer (Default)" />
                  <CardBody>
                    <p style={{ margin: 0 }}>Footer actions aligned to the right (default).</p>
                  </CardBody>
                  <CardFooter align="right">
                    <Button variant="ghost">Cancel</Button>
                    <Button variant="primary">Save</Button>
                  </CardFooter>
                </Card>
              </div>

              <div style={{
                marginTop: '1rem',
                background: '#1f2937',
                color: '#e5e7eb',
                padding: '1rem',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
{`<CardFooter align="left">...</CardFooter>
<CardFooter align="center">...</CardFooter>
<CardFooter align="between">...</CardFooter>
<CardFooter align="right">...</CardFooter> // default`}
              </div>
            </ComponentDemo>
          </ComponentCard>

          {/* Interactive Cards */}
          <ComponentCard style={{ gridColumn: '1 / -1' }}>
            <ComponentLabel>Interactive Cards</ComponentLabel>
            <ComponentDemo>
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <Card hoverable shadow>
                  <CardHeader title="Hoverable Card" />
                  <CardBody>
                    <p style={{ margin: 0 }}>Hover over me to see the effect!</p>
                  </CardBody>
                </Card>

                <Card clickable hoverable shadow onClick={() => alert('Card clicked!')}>
                  <CardHeader title="Clickable Card" />
                  <CardBody>
                    <p style={{ margin: 0 }}>Click me to trigger an action!</p>
                  </CardBody>
                </Card>

                <Card shadow={false}>
                  <CardHeader title="No Shadow" />
                  <CardBody>
                    <p style={{ margin: 0 }}>Card without shadow.</p>
                  </CardBody>
                </Card>
              </div>

              <div style={{
                marginTop: '1rem',
                background: '#1f2937',
                color: '#e5e7eb',
                padding: '1rem',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
{`<Card hoverable shadow>...</Card>
<Card clickable hoverable shadow onClick={() => {...}}>...</Card>
<Card shadow={false}>...</Card>`}
              </div>
            </ComponentDemo>
          </ComponentCard>

          {/* Card Props Documentation */}
          <ComponentCard style={{ gridColumn: '1 / -1' }}>
            <ComponentLabel>Component Props</ComponentLabel>
            <ComponentDemo>
              <div style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                padding: '1.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#111827' }}>
                  Card Component Props
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Prop</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Default</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>variant</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>default</td>
                      <td style={{ padding: '0.5rem' }}>primary | success | warning | danger | default</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>rounded</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>md</td>
                      <td style={{ padding: '0.5rem' }}>sm | md | lg - Border radius size</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>shadow</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>Boolean</td>
                      <td style={{ padding: '0.5rem' }}>true</td>
                      <td style={{ padding: '0.5rem' }}>Show box shadow</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>hoverable</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>Boolean</td>
                      <td style={{ padding: '0.5rem' }}>false</td>
                      <td style={{ padding: '0.5rem' }}>Enable hover effect</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>clickable</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>Boolean</td>
                      <td style={{ padding: '0.5rem' }}>false</td>
                      <td style={{ padding: '0.5rem' }}>Show pointer cursor</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>onClick</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>Function</td>
                      <td style={{ padding: '0.5rem' }}>-</td>
                      <td style={{ padding: '0.5rem' }}>Click handler</td>
                    </tr>
                  </tbody>
                </table>

                <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: '#111827' }}>
                  CardHeader Props
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Prop</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Default</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>title</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>-</td>
                      <td style={{ padding: '0.5rem' }}>Header title text</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>actions</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>ReactNode</td>
                      <td style={{ padding: '0.5rem' }}>-</td>
                      <td style={{ padding: '0.5rem' }}>Action buttons or components</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>size</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>md</td>
                      <td style={{ padding: '0.5rem' }}>sm | md | lg - Title size</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>divider</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>Boolean</td>
                      <td style={{ padding: '0.5rem' }}>true</td>
                      <td style={{ padding: '0.5rem' }}>Show bottom border</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>padding</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>1rem 1.5rem</td>
                      <td style={{ padding: '0.5rem' }}>Custom padding</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>background</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>transparent</td>
                      <td style={{ padding: '0.5rem' }}>Custom background color</td>
                    </tr>
                  </tbody>
                </table>

                <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: '#111827' }}>
                  CardBody Props
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Prop</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Default</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>padding</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>1.5rem</td>
                      <td style={{ padding: '0.5rem' }}>Custom padding</td>
                    </tr>
                  </tbody>
                </table>

                <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: '#111827' }}>
                  CardFooter Props
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Prop</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Default</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>align</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>right</td>
                      <td style={{ padding: '0.5rem' }}>left | center | between | right</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>divider</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>Boolean</td>
                      <td style={{ padding: '0.5rem' }}>true</td>
                      <td style={{ padding: '0.5rem' }}>Show top border</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>padding</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>1rem 1.5rem</td>
                      <td style={{ padding: '0.5rem' }}>Custom padding</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>background</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>transparent</td>
                      <td style={{ padding: '0.5rem' }}>Custom background color</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                  <strong style={{ color: '#1e40af' }}>💡 Usage Tips:</strong>
                  <ul style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.5rem', color: '#1e3a8a' }}>
                    <li>Use Header, Body, Footer structure like Bootstrap for consistency</li>
                    <li>Pass action buttons as React components in CardHeader actions prop</li>
                    <li>Control footer alignment with the align prop: left, center, between, right</li>
                    <li>Use variants to match card purpose: primary, success, warning, danger</li>
                    <li>Combine hoverable + clickable for interactive cards</li>
                    <li>Disable dividers with divider={'{'}false{'}'} for a cleaner look</li>
                  </ul>
                </div>
              </div>
            </ComponentDemo>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Table Section */}
      <Section>
        <SectionTitle>Tables</SectionTitle>
        <ComponentGrid>
          <ComponentCard style={{ gridColumn: '1 / -1' }}>
            <ComponentLabel>Normal Table</ComponentLabel>
            <ComponentDemo>
              <Table
                columns={tableColumns}
                data={tableData}
                hoverable
                onRowClick={(row) => console.log('Clicked row:', row)}
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard style={{ gridColumn: '1 / -1' }}>
            <ComponentLabel>Striped Table</ComponentLabel>
            <ComponentDemo>
              <Table
                columns={tableColumns}
                data={tableData}
                striped
                hoverable={false}
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Loading State</ComponentLabel>
            <ComponentDemo>
              <Table
                columns={tableColumns}
                data={[]}
                loading
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Empty State</ComponentLabel>
            <ComponentDemo>
              <Table
                columns={tableColumns}
                data={[]}
                emptyText="No users found"
                emptySubtext="Try adding some users to get started"
              />
            </ComponentDemo>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Loading Component Section */}
      <Section>
        <SectionTitle>Loading Component</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentLabel>Spinner Types</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Oval (Default)</StateLabel>
              <Loading type="oval" size="medium" />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Three Dots</StateLabel>
              <Loading type="dots" size="medium" />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Tail Spin</StateLabel>
              <Loading type="tailspin" size="medium" />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Circles</StateLabel>
              <Loading type="circles" size="medium" />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>More Spinner Types</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Rotating Lines</StateLabel>
              <Loading type="rotating" size="medium" />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Puff</StateLabel>
              <Loading type="puff" size="medium" />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Rings</StateLabel>
              <Loading type="rings" size="medium" />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Color Ring</StateLabel>
              <Loading type="color-ring" size="medium" />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Spinner Sizes</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Small (40px)</StateLabel>
              <Loading type="oval" size="small" />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Medium (60px)</StateLabel>
              <Loading type="oval" size="medium" />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Large (80px)</StateLabel>
              <Loading type="oval" size="large" />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Custom Size (100px)</StateLabel>
              <Loading type="oval" size={100} />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>With Text</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Loading with text</StateLabel>
              <Loading type="oval" size="medium" text="Loading..." />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Custom text</StateLabel>
              <Loading type="tailspin" size="medium" text="Please wait..." textSize="large" />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Fetching data</StateLabel>
              <Loading type="circles" size="medium" text="Fetching data..." textColor="#6BB9E8" textWeight="500" />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard style={{ gridColumn: '1 / -1' }}>
            <ComponentLabel>Color Variations</ComponentLabel>
            <ComponentDemo>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <StateLabel>Primary Blue</StateLabel>
                  <Loading type="oval" size="medium" color="#6BB9E8" text="Primary" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <StateLabel>Success Green</StateLabel>
                  <Loading type="oval" size="medium" color="#8DC63F" text="Success" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <StateLabel>Danger Red</StateLabel>
                  <Loading type="oval" size="medium" color="#ef4444" text="Error" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <StateLabel>Warning Orange</StateLabel>
                  <Loading type="oval" size="medium" color="#f59e0b" text="Warning" />
                </div>
              </div>
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard style={{ gridColumn: '1 / -1' }}>
            <ComponentLabel>Overlay Examples</ComponentLabel>
            <ComponentDemo>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ position: 'relative', height: '150px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <p style={{ padding: '1rem', margin: 0 }}>Content behind overlay</p>
                  <Loading overlay type="oval" size="small" text="Loading..." />
                </div>
                <div style={{ position: 'relative', height: '150px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <p style={{ padding: '1rem', margin: 0 }}>Content with blur</p>
                  <Loading overlay blur type="tailspin" size="small" text="Processing..." />
                </div>
                <div style={{ position: 'relative', height: '150px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <p style={{ padding: '1rem', margin: 0 }}>Dark overlay</p>
                  <Loading overlay overlayColor="rgba(0,0,0,0.5)" type="rotating" size="small" text="Please wait..." textColor="#fff" />
                </div>
              </div>
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard style={{ gridColumn: '1 / -1' }}>
            <ComponentLabel>Usage in Cards</ComponentLabel>
            <ComponentDemo>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <Card>
                  <CardHeader title="Loading State" />
                  <CardBody>
                    <Loading type="dots" size="medium" text="Loading content..." minHeight="150px" />
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader title="Processing" />
                  <CardBody>
                    <Loading type="mutating" size="medium" text="Processing your request..." minHeight="150px" />
                  </CardBody>
                </Card>
              </div>
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard style={{ gridColumn: '1 / -1' }}>
            <ComponentLabel>Component Props Documentation</ComponentLabel>
            <ComponentDemo>
              <div style={{
                background: '#f9fafb',
                padding: '1.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#111827' }}>
                  Loading Component Props
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Prop</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Default</th>
                      <th style={{ padding: '0.5rem', fontWeight: 600 }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>type</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>oval</td>
                      <td style={{ padding: '0.5rem' }}>Spinner type: oval, dots, circles, tailspin, puff, rings, hearts, grid, audio, triangle, bars, revolving, rotating, mutating, watch, color-ring, ball-triangle</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>size</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String | Number</td>
                      <td style={{ padding: '0.5rem' }}>medium</td>
                      <td style={{ padding: '0.5rem' }}>small (40), medium (60), large (80), or custom number</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>color</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>#6BB9E8</td>
                      <td style={{ padding: '0.5rem' }}>Primary spinner color</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>secondaryColor</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>#8DC63F</td>
                      <td style={{ padding: '0.5rem' }}>Secondary color for some spinners</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>text</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>-</td>
                      <td style={{ padding: '0.5rem' }}>Loading text to display below spinner</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>textSize</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>medium</td>
                      <td style={{ padding: '0.5rem' }}>small, medium, large</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>textColor</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>#6b7280</td>
                      <td style={{ padding: '0.5rem' }}>Text color</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>textWeight</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>400</td>
                      <td style={{ padding: '0.5rem' }}>Text font weight</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>overlay</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>Boolean</td>
                      <td style={{ padding: '0.5rem' }}>false</td>
                      <td style={{ padding: '0.5rem' }}>Show as overlay with background</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>overlayColor</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>rgba(255,255,255,0.9)</td>
                      <td style={{ padding: '0.5rem' }}>Background color for overlay</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>blur</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>Boolean</td>
                      <td style={{ padding: '0.5rem' }}>false</td>
                      <td style={{ padding: '0.5rem' }}>Apply backdrop blur effect when overlay is true</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>height</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>auto</td>
                      <td style={{ padding: '0.5rem' }}>Container height</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>minHeight</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>auto</td>
                      <td style={{ padding: '0.5rem' }}>Container minimum height</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>width</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>100%</td>
                      <td style={{ padding: '0.5rem' }}>Container width</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>padding</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>0</td>
                      <td style={{ padding: '0.5rem' }}>Container padding</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#6366f1' }}>gap</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>String</td>
                      <td style={{ padding: '0.5rem' }}>1rem</td>
                      <td style={{ padding: '0.5rem' }}>Gap between spinner and text</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                  <strong style={{ color: '#1e40af' }}>💡 Usage Examples:</strong>
                  <div style={{ marginTop: '0.75rem', background: '#1f2937', color: '#e5e7eb', padding: '1rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
{`// Simple loading
<Loading type="oval" size="medium" text="Loading..." />

// Custom colors
<Loading type="tailspin" color="#8DC63F" text="Processing..." />

// Overlay loading
<div style={{ position: 'relative' }}>
  <YourContent />
  <Loading overlay blur type="circles" text="Loading..." />
</div>

// In a card
<Card>
  <CardBody>
    <Loading type="dots" minHeight="200px" text="Fetching data..." />
  </CardBody>
</Card>`}
                  </div>
                </div>
              </div>
            </ComponentDemo>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Badges Section */}
      <Section>
        <SectionTitle>Badges</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentLabel>Badge Variants</ComponentLabel>
            <ComponentDemo>
              <Badge>Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="warning">Warning</Badge>
            </ComponentDemo>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Color Palette Section */}
      <Section>
        <SectionTitle>Color Palette</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentLabel>Primary Colors</ComponentLabel>
            <ColorPalette>
              <ColorSwatch color="#6BB9E8">
                <div>Primary</div>
                <div>#6BB9E8</div>
              </ColorSwatch>
              <ColorSwatch color="#4A9ED4">
                <div>Primary Dark</div>
                <div>#4A9ED4</div>
              </ColorSwatch>
              <ColorSwatch color="#8ECDF0" light>
                <div>Primary Light</div>
                <div>#8ECDF0</div>
              </ColorSwatch>
            </ColorPalette>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Secondary & Accent</ComponentLabel>
            <ColorPalette>
              <ColorSwatch color="#8DC63F">
                <div>Success/Green</div>
                <div>#8DC63F</div>
              </ColorSwatch>
              <ColorSwatch color="#6BA32E">
                <div>Green Dark</div>
                <div>#6BA32E</div>
              </ColorSwatch>
              <ColorSwatch color="#A8D86A" light>
                <div>Green Light</div>
                <div>#A8D86A</div>
              </ColorSwatch>
            </ColorPalette>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Status Colors</ComponentLabel>
            <ColorPalette>
              <ColorSwatch color="#ef4444">
                <div>Error</div>
                <div>#ef4444</div>
              </ColorSwatch>
              <ColorSwatch color="#f59e0b">
                <div>Warning</div>
                <div>#f59e0b</div>
              </ColorSwatch>
            </ColorPalette>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Neutral Colors</ComponentLabel>
            <ColorPalette>
              <ColorSwatch color="#111827">
                <div>Gray 900</div>
                <div>#111827</div>
              </ColorSwatch>
              <ColorSwatch color="#374151">
                <div>Gray 700</div>
                <div>#374151</div>
              </ColorSwatch>
              <ColorSwatch color="#6b7280">
                <div>Gray 500</div>
                <div>#6b7280</div>
              </ColorSwatch>
              <ColorSwatch color="#9ca3af">
                <div>Gray 400</div>
                <div>#9ca3af</div>
              </ColorSwatch>
              <ColorSwatch color="#d1d5db" light>
                <div>Gray 300</div>
                <div>#d1d5db</div>
              </ColorSwatch>
              <ColorSwatch color="#e5e7eb" light>
                <div>Gray 200</div>
                <div>#e5e7eb</div>
              </ColorSwatch>
              <ColorSwatch color="#f9fafb" light>
                <div>Gray 50</div>
                <div>#f9fafb</div>
              </ColorSwatch>
            </ColorPalette>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Typography Section */}
      <Section>
        <SectionTitle>Typography</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentLabel>Headings</ComponentLabel>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
              Heading 1
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
              Heading 2
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Heading 3
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Heading 4
            </div>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Body Text</ComponentLabel>
            <div style={{ fontSize: '1rem', color: '#374151', marginBottom: '0.5rem' }}>
              Body Large (1rem / 16px)
            </div>
            <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
              Body Normal (0.875rem / 14px)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Body Small (0.75rem / 12px)
            </div>
            <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>
              Caption (0.625rem / 10px)
            </div>
          </ComponentCard>
        </ComponentGrid>
      </Section>
    </Container>
  )
}

export default UITest
