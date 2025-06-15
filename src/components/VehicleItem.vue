<script setup>
import {computed} from 'vue';
import {useVehicleStore} from '../store/vehicle-store.ts';

const store = useVehicleStore();

const {itemId} = defineProps({
  itemId: {
    type: Number,
    required: true,
  },
});

const item = computed(() => {
  return store.getVehicle(itemId);
});

const info = computed(() => {
  return store.getVehicleInfo(itemId);
});

function removeItem(id) {
  store.removeVehicle(id);
}

</script>
<template>
  <div class="list-item card my-1">
    <div class="card-body">

      <div class="row">
        <div class="col-auto">
          <span class="btn btn-secondary btn-sm btn-grab me-2">:::</span>

        </div>
        <div class="col-auto">
          <input class="form-control d-inline-block" v-model="item.display_name"/>
        </div>
        <div class="col-auto">
          <button @click="removeItem(item.id)" class="btn btn-danger d-inline-block">X</button>
        </div>
      </div>
      <div>
        <strong>ID:</strong> {{ info.id }}
      </div>
      <div>
        <strong> Name:</strong> {{ info.display_name }}
      </div>
      <div>
        <strong>Length:</strong> {{ info.display_name_len }}
      </div>
    </div>
  </div>
</template>
