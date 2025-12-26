import prisma from '../../../prisma/client.js'

const getSkripsiConstantsService = async () => {
  const constants = await prisma.skripsi_constants.findMany({
    orderBy: {
      key: 'asc'
    }
  })

  // Convert to key-value object for easier frontend consumption
  const constantsObj = constants.reduce((acc, constant) => {
    acc[constant.key] = {
      value: constant.value,
      description: constant.description,
      id: constant.id
    }
    return acc
  }, {})

  return {
    constants: constantsObj,
    raw: constants
  }
}

export default getSkripsiConstantsService
