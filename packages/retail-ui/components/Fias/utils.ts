import {
  Address,
  AddressElement,
  EstateStatuses,
  StructureStatuses,
  isLevelElement,
  isHouse,
  isRoom,
  LevelElement
} from './types';

// TODO неразрывнях пробелов наставить между топонимом и его типом
export function elementName(element: AddressElement, _for?: string): string {
  if (!element) {
    // TODO разобрать когда апи поменяют
    return '';
  }

  if (isLevelElement(element)) {
    switch (element.abbreviation) {
      case 'Респ':
        return 'Республика ' + element.name;

      case 'АО':
        if (element.name !== 'Ханты-Мансийский Автономный округ - Югра') {
          return element.name + ' автономный округ';
        }
        break;

      case 'обл':
        return element.name + ' область';

      case 'край':
        return element.name + ' край';

      case 'р-н':
        return (_for !== 'district' ? 'район ' : '') + element.name;

      case 'г':
        return (_for !== 'city' ? 'город ' : '') + element.name;

      case 'д':
        return 'деревня ' + element.name;

      case 'п':
        return 'поселок ' + element.name;

      case 'с':
        return 'село ' + element.name;

      case 'ст-ца':
        return 'станица ' + element.name;

      case 'с/с':
        return 'сельсовет ' + element.name;

      case 'ул':
        return (_for !== 'street' ? 'улица ' : '') + element.name;

      case 'пл':
        return 'площадь ' + element.name;

      case 'пр-кт':
        return 'проспект ' + element.name;

      case 'проезд':
        return 'проезд ' + element.name;

      case 'тер':
        return 'тер ' + element.name;

      case 'кв-л':
        return element.name + ' квартал';

      case 'пер':
        return element.name + ' переулок';

      case 'Чувашия':
        return element.name + ' ' + element.abbreviation;

      case 'Аобл':
        return element.name + ' автономная область';
    }
  }

  let result = '';

  if (isHouse(element)) {
    if (element.estateStatus !== EstateStatuses.None) {
      switch (element.estateStatus) {
        case EstateStatuses.Hold:
          result = result + ' владение';
          break;
        case EstateStatuses.House:
          result = result + ' дом';
          break;
        case EstateStatuses.HouseHold:
          result = result + ' домовладение';
          break;
      }
    }

    if (element.number) {
      result = result + ' ' + element.number;
    }

    if (
      element.structureStatus &&
      element.structureStatus !== StructureStatuses.None
    ) {
      const structureNumber = element.structureNumber
        ? ' ' + element.structureNumber
        : '';
      switch (element.structureStatus) {
        case StructureStatuses.Structure:
          result = result + ' строение' + structureNumber;
          break;
        case StructureStatuses.Construction:
          result = result + ' cооружение' + structureNumber;
          break;
        case StructureStatuses.Liter:
          result = result + ' литера' + structureNumber;
          break;
      }
    }

    if (element.buildingNumber) {
      result = result + ' корпус ' + element.buildingNumber;
    }
  }

  if (isRoom(element)) {
    if (element.fiasId) {
      result = `квартира ${element.flatNumber}`;
    } else {
      result = element.flatNumber;
    }
  }

  if (result) {
    return result.trim();
  } else {
    return (element as LevelElement).name || '';
  }
}

export const ADDRESS_FIELDS = [
  'region',
  'district',
  'city',
  'settlement',
  'planningStructure',
  'street',
  'stead',
  'house',
  'room'
];

export function getLastFiasId(
  address: Address,
  parentFields: string[]
): string | undefined {
  const parents = (parentFields || ADDRESS_FIELDS).slice().reverse();
  for (const parentName of parents) {
    const parent: AddressElement = address[parentName];
    if (parent && typeof parent === 'object' && parent.fiasId) {
      return parent.fiasId;
    }
  }
}

export function getAddressText(address: Address): string | null {
  if (!address) {
    return null;
  }
  const text = (element: AddressElement) => element && elementName(element);
  return [
    text(address.region),
    text(address.district),
    text(address.city),
    text(address.settlement),
    text(address.planningStructure),
    text(address.street),
    text(address.house),
    text(address.stead),
    text(address.room)
  ]
    .filter(x => !!x)
    .join(', ');
}
