# Integration Guide for Memoized Components

## Replace the fields.map section in index.jsx (around line 211-457)

Find this line:
```jsx
{formData.fields.map((field, index) => (
  <FieldItem
    key={index}
    draggable
    ...
  </FieldItem>
))}
```

Replace it with:
```jsx
{formData.fields.map((field, index) => (
  <FieldItem
    key={index}
    field={field}
    index={index}
    draggedIndex={draggedIndex}
    errors={errors}
    fields={formData.fields}
    onFieldItemChange={handleFieldItemChange}
    onRemoveField={removeField}
    onDragStart={handleDragStart}
    onDragOver={handleDragOver}
    onDrop={handleDrop}
    onDragEnd={handleDragEnd}
    onAddFieldOption={addFieldOption}
    onRemoveFieldOption={removeFieldOption}
    onFieldOptionChange={handleFieldOptionChange}
    onOptionImageUpload={handleOptionImageUpload}
    onOptionImageRemove={handleOptionImageRemove}
    onAddDisplayCondition={addDisplayCondition}
    onRemoveDisplayCondition={removeDisplayCondition}
    onDisplayConditionChange={handleDisplayConditionChange}
  />
))}
```

This will make each field item render independently - only the field being edited will re-render!
