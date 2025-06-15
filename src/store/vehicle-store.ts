import {defineStore} from 'pinia';
import {useCachedCollectionStore} from './composables/cached-collection-store.js';
import {computed, readonly} from 'vue';

export interface Vehicle {
    readonly id: number;
    readonly display_name: string;
}

export interface VehicleInfo {
    readonly id: number;
    readonly display_name: string;
    readonly display_name_len: number;
}

export interface VehicleCreate {
    display_name: string;
}

export interface VehicleUpdate {
    display_name?: string;
}

function makeItem(id: number, input: VehicleCreate): Vehicle {
    const {
        display_name,
    } = input;

    return {
        id,
        display_name,
    };
}

function makeItemInfo(item: Vehicle): VehicleInfo {
    console.log('recomputing item info: ', item.id);

    // trivial reduced case in place of a more substantial example
    return readonly({
        ...item,
        display_name_len: item.display_name.length,
    });
}

export const useVehicleStore = defineStore('vehicles', () => {
        const {
            get,
            create,
            move,
            remove,
            update,
            getInfo,
            items,
        } = useVehicleCacheStore();

        const vehicles_info = computed(() => items.map(item => getInfo(item.id)));

        return {
            getVehicle: get,
            addVehicle: create,
            removeVehicle: remove,
            updateVehicle: update,
            getVehicleInfo: getInfo,
            moveVehicle: move,

            vehicles: items,
            vehicles_info,
        };
    }
);

export const useVehicleCacheStore = defineStore('vehicles-cache', () => {
        return useCachedCollectionStore<Vehicle, VehicleCreate, VehicleUpdate, VehicleInfo>({
            makeItem,
            makeItemInfo,
        });
    },
    {
        persist: {
            pick: [
                'items',
                'items_id_increment',
            ],
        },
    }
);


