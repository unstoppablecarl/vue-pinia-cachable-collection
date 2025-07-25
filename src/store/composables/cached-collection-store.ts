import {computed, type ComputedRef, readonly, type Ref, ref, toValue} from 'vue';
import {watchArray} from '@vueuse/core';

export interface HasId {
    id: number;
}

export interface MakeItemContext<Item> {
    items: Ref<Item[]>;
    getIndex: (id: number) => number;
    get: (id: number) => Item;
}

export function useCachedCollectionStore<
  Item extends HasId,
  ItemCreate,
  ItemUpdate,
  ItemInfo,
  ItemMake extends ItemCreate & HasId = ItemCreate & HasId
>({
      makeItemInfo,
      makeItem
  }: {
    makeItemInfo: (item: Item, context: MakeItemContext<Item>) => ItemInfo,
    makeItem: (item: ItemMake) => Item
}) {
    const items = ref<Item[]>([]) as Ref<Item[]>;
    const items_info_cache = new Map<number, ComputedRef<ItemInfo>>();
    const items_id_increment = ref(0);

    watchArray(items, (_newList, _oldList, _added, removed) => {
        removed.forEach(item => {
            items_info_cache.delete(item.id);
        });
    });

    function bindItem(item: Item) {
        const context: MakeItemContext<Item> = {
            get,
            items,
            getIndex
        }

        const info = computed(() => makeItemInfo(item, context));
        items_info_cache.set(item.id, info);
        return info;
    }

    function add(obj: ItemCreate) {
        const item = make(obj)
        items.value.push(item);
    }

    function remove(itemId: number) {
        const index = items.value.findIndex((item) => item.id === itemId);

        items.value.splice(index, 1);
    }

    function update(id: number, input: ItemUpdate) {
        const item = get(id);

        Object.assign(item, input);
    }

    function make(input: ItemCreate) {
        const id = items_id_increment.value++;

        return makeItem({...input, id} as ItemMake);
    }

    function get(itemId: number) {
        const item = items.value.find(item => item.id === itemId);
        if (!item) {
            throw new Error(`Item: ${itemId} not found`);
        }
        return item;
    }

    function getIndex(itemId: number) {
        return items.value.findIndex((item) => item.id === itemId);
    }

    function move(itemId: number, toIndex: number) {
        const fromIndex = getIndex(itemId);
        let item = items.value.splice(fromIndex, 1)[0];
        items.value.splice(toIndex, 0, item);
    }

    function getInfo(itemId: number) {
        let info = items_info_cache.get(itemId);
        if (!info) {
            info = bindItem(get(itemId) as Item);
        }
        return toValue(info);
    }

    const items_info = computed(() => {
        return items.value.map(item => getInfo(item.id));
    });

    return {
        get,
        add,
        move,
        remove,
        update,
        getInfo,
        getIndex,

        items,
        items_info,
        items_id_increment: readonly(items_id_increment),
    };
}
