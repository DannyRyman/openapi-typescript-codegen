
export type EnumProp =
  'loan'
  | 'bond'

export const enumPropValues: EnumProp[] = [
  'loan',
  'bond'
]
export type ArrayOfEnumProp =
  'Option 1'
  | 'Option 2'

export const arrayOfEnumPropValues: ArrayOfEnumProp[] = [
  'Option 1',
  'Option 2'
]
export type SharedEnum =
  'Loan'
  | 'Bond'

export const sharedEnumValues: SharedEnum[] = [
  'Loan',
  'Bond'
]

export interface SampleDefinition {
  integerProp?: number
  numberProp?: number
  boolProp?: boolean
  dateProp?: string
  dateTimeProp?: string
  stringProp?: string
  requiredProp: string
  complexProp?: SampleDefinition2
  simpleArrayProp?: string[]
  complexArrayProp?: SampleDefinition2[]
  enumProp?: EnumProp
  referencedEnumProp?: SharedEnum
  arrayOfEnumProp?: ArrayOfEnumProp[]
}

export interface SampleDefinition2 {
  prop1?: string
}

