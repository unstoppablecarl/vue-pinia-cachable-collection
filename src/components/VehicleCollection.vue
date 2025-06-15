<script setup>
import {useVehicleStore} from '../store/vehicle-store.ts';
import VehicleItem from './VehicleItem.vue';
import {storeToRefs} from 'pinia';
import draggable from 'vuedraggable';

const store = useVehicleStore();

const {vehicles, vehicles_info} = storeToRefs(store);

function addItem(display_name) {
  store.addVehicle({display_name});
}

function onSortableChange(event) {
  let moved = event.moved;
  if (!moved) {
    return;
  }
  store.moveVehicle(moved.element.id, moved.newIndex);
}

</script>
<template>

  <draggable
      :list="vehicles"
      draggable=".list-item"
      tag="div"
      item-key="id"
      group="vehicles"
      handle=".btn-grab"
      ghost-class="ghost"
      @change="onSortableChange"
      :animation="200"
      :preventOnFilter="false"
  >
    <template #item="{ element, index }">
      <vehicle-item :item-id="element.id"/>
    </template>
  </draggable>

  <button class="btn btn-primary my-2" @click="addItem('something')">Add</button>
  <div class="fw-bold"><code class="d-inline">vehicles_info</code> Array</div>
  <div v-for="info in vehicles_info" :key="info.id">
    {{info}}
  </div>
</template>