import prisma from '../client.js'

export async function seedCalculatorConstants() {
  console.log('Seeding calculator constants...')

  const constants = [
    {
      key: 'calculator_feature_title',
      value: 'Kalkulator Medis'
    },
    {
      key: 'calculator_feature_description',
      value: 'Kalkulator medis yang dapat dikonfigurasi untuk berbagai perhitungan klinis dan medis'
    },
    {
      key: 'calculator_credit_cost',
      value: '0'
    }
  ]

  for (const constant of constants) {
    await prisma.constants.upsert({
      where: { key: constant.key },
      update: { value: constant.value },
      create: constant
    })
  }

  console.log('Calculator constants seeded successfully')
}

seedCalculatorConstants()