export function formatPHP(amount){
  // accept number or numeric string with or without currency symbol
  let num = typeof amount === 'number' ? amount : Number(String(amount).replace(/[^0-9.-]+/g, ''))
  if (Number.isNaN(num)) num = 0
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(num)
}
