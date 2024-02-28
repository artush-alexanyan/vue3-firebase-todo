<template>
  <div class="fixed bottom-10 right-6">
    <ul>
      <li
        :class="mess.type === 'Error' ? 'text-red-500' : 'text-green-600'"
        class="flex items-center justify-between px-2 my-2"
        v-for="(mess, index) in messages"
        :key="index"
      >
        <span>{{ mess.message }}</span>
        <button @click="removeMessage(index)" type="button">
          <i class="pi pi-times text-gray-500 ml-4"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TodoMessages",
  props: {
    messages: Array,
  },

  setup(props, { emit }) {
    const removeMessage = (index) => {
      emit("removeMessage", index);
    };
    return {
      removeMessage,
    };
  },
});
</script>
