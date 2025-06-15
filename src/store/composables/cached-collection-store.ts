import {computed, type ComputedRef, type Reactive, reactive, type Ref, ref, toValue} from 'vue';
import {watchArray} from '@vueuse/core';

export interface BaseCachedCollectionStore<Item, ItemCreate = object, ItemUpdate = object, ItemInfo = object> {
    get: (id: number) => Item;
    create: (input: ItemCreate) => Item;
    remove: (id: number) => void;
    update: (id: number, obj: ItemUpdate) => Item;
    getInfo: (id: number) => ItemInfo;
    getIndex: (id: number) => number;
    move: (id: number, newIndex: number) => void;

    items: Ref<Item[]>;
    items_id_increment: Ref<number>;
    items_info_cache: Reactive<Map<number, ComputedRef<ItemInfo>>>
}

export function useCachedCollectionStore<
    Item extends { id: number },
    ItemCreate,
    ItemUpdate,
    ItemInfo
>({
      makeItemInfo,
      makeItem
  }: {
    makeItemInfo: (item: Item) => ItemInfo,
    makeItem: (id: number, item: ItemCreate) => Item,
}): BaseCachedCollectionStore<
    Item,
    ItemCreate,
    ItemUpdate,
    ItemInfo
> {
    const items: Ref<Item[]> = ref([]);
    const items_info_cache = reactive(new Map<number, ComputedRef<ItemInfo>>());
    const items_id_increment = ref<number>(0);

    watchArray(items, (_newList, _oldList, _added, removed) => {
        removed.forEach(item => {
            items_info_cache.delete(item.id);
        });
    });

    function bindItem(item: Item): ComputedRef<ItemInfo> {
        let info = computed(() => {
            return makeItemInfo(item);
        });
        items_info_cache.set(item.id, info);
        return info;
    }

    function create(input: ItemCreate): Item {
        const id = items_id_increment.value++

        const item: Item = makeItem(id, input);
        items.value.push(item);

        return item;
    }

    function remove(itemId: number) {
        const index = items.value.findIndex((item) => item.id === itemId);

        items.value.splice(index, 1);
    }

    function update(id: number, input: ItemUpdate): Item {
        const item = get(id);

        Object.assign(item, input);

        return item
    }

    function get(itemId: number): Item {
        const item = items.value.find(item => item.id === itemId);
        if (!item) {
            throw new Error(`Item: ${itemId} not found`);
        }
        return item;
    }

    function getIndex(itemId: number): number {
        return items.value.findIndex((item) => item.id === itemId);
    }

    function move(itemId: number, toIndex: number): void {
        const fromIndex = getIndex(itemId);
        let item = items.value.splice(fromIndex, 1)[0];
        items.value.splice(toIndex, 0, item);
    }

    function getInfo(itemId: number): ItemInfo {
        let info = items_info_cache.get(itemId);
        if (!info) {
            info = bindItem(get(itemId));
        }
        return toValue(info);
    }

    return {
        get,
        create,
        move,
        remove,
        update,
        getInfo,
        getIndex,

        items_info_cache,

        items,
        items_id_increment,
    };
}