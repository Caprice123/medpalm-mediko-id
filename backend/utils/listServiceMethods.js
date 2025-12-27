/**
 * Utility to list all static methods of a service class
 * Usage: node utils/listServiceMethods.js <service-path>
 */

import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Get all static methods of a class
 * @param {Class} ServiceClass - The service class to analyze
 * @returns {Object} Object with sync and async methods
 */
export function listServiceMethods(ServiceClass) {
  const className = ServiceClass.name
  const allProps = Object.getOwnPropertyNames(ServiceClass)

  const methods = {
    className,
    sync: [],
    async: [],
    all: []
  }

  allProps.forEach(name => {
    // Skip constructor and length
    if (name === 'constructor' || name === 'length' || name === 'prototype' || name === 'name') {
      return
    }

    const descriptor = Object.getOwnPropertyDescriptor(ServiceClass, name)

    if (typeof descriptor.value === 'function') {
      const method = descriptor.value
      const isAsync = method.constructor.name === 'AsyncFunction'

      const methodInfo = {
        name,
        isAsync,
        params: getMethodParams(method)
      }

      methods.all.push(methodInfo)

      if (isAsync) {
        methods.async.push(methodInfo)
      } else {
        methods.sync.push(methodInfo)
      }
    }
  })

  return methods
}

/**
 * Extract parameter names from a function
 */
function getMethodParams(func) {
  const funcString = func.toString()

  // Match function parameters
  const match = funcString.match(/\(([^)]*)\)/)
  if (!match) return []

  const params = match[1]
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => {
      // Handle destructuring
      if (p.startsWith('{')) {
        return p
      }
      // Handle default values
      return p.split('=')[0].trim()
    })

  return params
}

/**
 * Print methods in a formatted way
 */
export function printServiceMethods(ServiceClass) {
  const methods = listServiceMethods(ServiceClass)

  console.log('\n' + '='.repeat(60))
  console.log(`📦 Service: ${methods.className}`)
  console.log('='.repeat(60))

  console.log('\n🔵 Async Methods:')
  if (methods.async.length === 0) {
    console.log('   None')
  } else {
    methods.async.forEach(m => {
      console.log(`   ✓ async ${m.name}(${m.params.join(', ')})`)
    })
  }

  console.log('\n⚪ Sync Methods:')
  if (methods.sync.length === 0) {
    console.log('   None')
  } else {
    methods.sync.forEach(m => {
      console.log(`   • ${m.name}(${m.params.join(', ')})`)
    })
  }

  console.log('\n📊 Summary:')
  console.log(`   Total methods: ${methods.all.length}`)
  console.log(`   Async: ${methods.async.length}`)
  console.log(`   Sync: ${methods.sync.length}`)
  console.log('='.repeat(60) + '\n')

  return methods
}

// CLI Usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const servicePath = process.argv[2]

  if (!servicePath) {
    console.log('Usage: node utils/listServiceMethods.js <service-path>')
    console.log('Example: node utils/listServiceMethods.js services/flashcard/admin/createFlashcardDeckService.js')
    process.exit(1)
  }

  const fullPath = path.resolve(__dirname, '..', servicePath)

  import(fullPath)
    .then(module => {
      // Get the default export or first named export
      const ServiceClass = module.default || Object.values(module)[0]

      if (!ServiceClass) {
        console.error('❌ No service class found in module')
        process.exit(1)
      }

      printServiceMethods(ServiceClass)
    })
    .catch(err => {
      console.error('❌ Error loading service:', err.message)
      process.exit(1)
    })
}
