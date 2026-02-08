export type PizzaChoice = 'Veg' | 'NonVeg' | 'DeluxeVeg' | 'DeluxeNonVeg'

export function getBasePrice(choice: PizzaChoice): number {
  switch (choice) {
    case 'Veg': return 300
    case 'NonVeg': return 400
    case 'DeluxeVeg': return 550
    case 'DeluxeNonVeg': return 650
  }
}

export function calculateBill(
  basePrice: number,
  extraToppings: boolean,
  extraCheese: boolean,
  takeaway: boolean
): number {
  let bill = basePrice
  if (extraToppings) bill += 150
  if (extraCheese) bill += 100
  if (takeaway) bill += 20
  return bill
}
