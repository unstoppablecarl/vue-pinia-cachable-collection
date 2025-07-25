import { defineStore } from 'pinia'
import { type HasId, type MakeItemContext, useCachedCollectionStore } from './composables/cached-collection-store.js'
import { computed, readonly } from 'vue'

export interface Vehicle {
  readonly id: number;
  display_name: string;
}

export interface VehicleInfo {
  readonly id: number;
  readonly display_name: string;
  readonly display_name_len: number;
  readonly display_order: number;
}

export interface VehicleCreate {
  display_name: string;
}

export interface VehicleUpdate {
  display_name?: string;
}

function makeItem(input: VehicleCreate & HasId): Vehicle {
  const {
    id,
    display_name,
  } = input

  return {
    id,
    display_name,
  }
}

const makeItemInfo = (item: Vehicle, { getIndex }: MakeItemContext<Vehicle>) => {
  console.log('recomputing item info: ', item.id)

  return readonly({
    ...item,
    display_order: computed(() => getIndex(item.id)),
    display_name_len: item.display_name.length,
  })
}

export const useVehicleStore = defineStore('vehicles', () => {
    const {
      get,
      add,
      move,
      remove,
      update,
      getInfo,
      items,
    } = useVehicleCacheStore()

    const vehicles_info = computed(() => items.map(item => getInfo(item.id)))

    return {
      getVehicle: get,
      addVehicle: add,
      removeVehicle: remove,
      updateVehicle: update,
      getVehicleInfo: getInfo,
      moveVehicle: move,

      vehicles: items,
      vehicles_info,
    }
  },
)

export const useVehicleCacheStore = defineStore('vehicles-cache', () => {
    return useCachedCollectionStore<Vehicle, VehicleCreate, VehicleUpdate, VehicleInfo>({
      makeItem,
      makeItemInfo,
    })
  },
  {
    persist: {
      pick: [
        'items',
        'items_id_increment',
      ],
    },
  },
)


