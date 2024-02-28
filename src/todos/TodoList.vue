<template>
  <div>
    <div
      class="flex items-center justify-center space-x-3 text-lg py-20"
      v-if="loading"
    >
      <p>Loading todos...</p>
      <i class="pi pi-spinner pi-spin"></i>
    </div>

    <div v-else>
      <ul class="mt-10" v-if="todos.length > 0">
        <li
          v-for="todo in todos"
          :key="todo.id"
          class="flex items-center justify-between py-5 border-b border-b-gray-300"
        >
          <span v-if="todo.editing === false" class="flex items-center">
            <span class="font-semibold mr-4">{{ todo.title }}</span>
            <span class="text-gray-600 text-xs italic">{{
              formatEuropeanDate(todo.date)
            }}</span>
          </span>
          <span v-else>
            <input
              v-model="todo.title"
              type="text"
              class="py-1 px-2 rounded border border-gray-400 outline-0 focus:border-green-600"
              name=""
            />
          </span>
          <div class="flex items-center space-x-10 text-lg">
            <button v-if="todo.editing === true" @click="editTodoById(todo)">
              <i
                class="text-green-600"
                :class="todo.saving ? 'pi pi-spinner pi-spin' : 'pi pi-check'"
              ></i>
            </button>
            <button v-else @click="deleteTodoById(todo)">
              <i
                :class="
                  todo.deleting
                    ? 'pi pi-spinner pi-spin'
                    : 'pi pi-trash text-red-600'
                "
              ></i>
            </button>
            <button @click="startEditTodo(todo)">
              <i
                :class="
                  todo.editing
                    ? 'pi pi-times text-blue-600'
                    : 'pi pi-pencil text-green-600'
                "
              ></i>
            </button>
          </div>
        </li>
      </ul>
      <div class="text-center text-lg py-20" v-else>
        <p>No todos to show</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TodoList",
  props: {
    loading: Boolean,
    todos: Array,
  },

  setup(props, { emit }) {
    const createTodo = () => {
      emit("createTodo");
    };

    const deleteTodoById = (todo) => {
      emit("deleteTodoById", todo);
    };

    const editTodoById = (todo) => {
      emit("editTodoById", todo);
    };

    const startEditTodo = (todo) => {
      emit("startEditTodo", todo);
    };

    const formatEuropeanDate = (isoDateString) => {
      const isoDate = new Date(isoDateString);
      const europeanDateString = isoDate.toLocaleString("en-GB");

      return europeanDateString;
    };
    return {
      createTodo,
      deleteTodoById,
      editTodoById,
      startEditTodo,
      formatEuropeanDate,
    };
  },
});
</script>
