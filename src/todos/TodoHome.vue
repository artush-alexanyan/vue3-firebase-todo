<template>
  <div>
    <div class="font-serif bg-gray-50 h-screen">
      <h2 class="text-center text-4xl text-indigo-600 py-20">
        Vuejs Firebase Todo
      </h2>
      <div class="max-w-xl mx-auto p-10">
        <form @submit.prevent="createTodo">
          <div
            class="flex items-center border border-gray-400 bg-white rounded-full"
          >
            <input
              required
              :disabled="creating"
              type="text"
              v-model="todoText"
              class="w-full py-2.5 px-3 outline-0 rounded-full"
              placeholder="Enter todo name"
              name=""
            />
            <button
              :disabled="creating"
              type="submit"
              class="bg-indigo-500 hover:bg-indigo-700 text-white transition duration-500 easy-out py-2.5 px-2 whitespace-nowrap rounded-r-full text-center"
            >
              {{ creating ? "Creating..." : "Create todo" }}
            </button>
          </div>
        </form>
        <TodoList
          :todos="todos"
          :loading="loading"
          @deleteTodoById="deleteTodoById"
          @startEditTodo="startEditTodo"
          @editTodoById="editTodoById"
        />
        <TodoMessages 
          :messages="messages" 
          @removeMessage="removeMessage" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, defineComponent } from "vue";
import TodoList from "./TodoList.vue";
import TodoMessages from "./TodoMessages.vue";
import BASE_URL from "@/base-url/base-url.js";

export default defineComponent({
  name: "TodosHome",
  components: {
    TodoList,
    TodoMessages,
  },
  setup() {
    const todoText = ref("");
    const creating = ref(false);
    const loading = ref(false);
    const todos = ref([]);
    const messages = ref([]);

    const createTodo = async () => {
      const newTodo = {
        date: new Date(),
        title: todoText.value,
      };

      creating.value = true;

      try {
        await BASE_URL.post("/todos.json", newTodo);

        const response = await BASE_URL.get("/todos.json");
        const newTodos = response.data;

        // Here we're using the Firebase auto-generated document ID instead of generating our own
        // This ID is important for deleting and updating the document

        const todosWithFirebaseId = Object.keys(newTodos).map((firebaseId) => ({
          id: firebaseId,
          deleting: false,
          editing: false,
          saving: false,
          ...newTodos[firebaseId],
        }));

        todos.value = todosWithFirebaseId;

        todoText.value = "";
        creating.value = false;
      } catch (error) {
        creating.value = false;
        messages.value.push({
          type: "Error",
          message: error.message,
        });
      }
    };

    const deleteTodoById = async (todo) => {
      todo.deleting = true;

      try {
        await BASE_URL.delete(`/todos/${todo.id}.json`);
        messages.value.push({
          type: "Success",
          message: "Todo deleted successfully",
        });

        todos.value = todos.value.filter((item) => item.id !== todo.id);
      } catch (error) {
        messages.value.push({
          type: "Error",
          message: error.message,
        });
      } finally {
        todo.deleting = false;
      }
    };

    const startEditTodo = (todo) => {
      todo.editing = !todo.editing;
    };

    const editTodoById = async (todo) => {
      todo.saving = true;
      const editedTodo = {
        id: todo.id,
        title: todo.title,
        date: new Date(),
      };
      try {
        await BASE_URL.patch(`/todos/${todo.id}.json`, editedTodo);
        messages.value.push({
          type: "Success",
          message: "Todo updated successfully",
        });
        todo.saving = false;
        todo.editing = false;

        todos.value = todos.value.map((item) =>
          item.id === todo.id ? { id: todo.id, ...todo } : item
        );
      } catch (error) {
        messages.value.push({
          type: "Error",
          message: error.message,
        });
      } finally {
        todo.editing = false;
      }
    };

    const fetchTodos = async () => {
      loading.value = true;
      try {
        const response = await BASE_URL.get("/todos.json");

        const allTodos = response.data;

        const todosWithFirebaseId = Object.keys(allTodos).map((firebaseId) => ({
          id: firebaseId,
          deleting: false,
          editing: false,
          saving: false,
          ...allTodos[firebaseId],
        }));

        todos.value = todosWithFirebaseId;
        loading.value = false;
      } catch (error) {
        loading.value = false;
        messages.value.push({
          type: "Error",
          message: error.message,
        });
      }
    };

    const removeMessage = (index) => {
      if (index >= 0 && index < messages.value.length) {
        messages.value.splice(index, 1);
      }
    };

    onMounted(() => fetchTodos());

    return {
      todoText,
      creating,
      loading,
      todos,
      messages,
      createTodo,
      deleteTodoById,
      startEditTodo,
      editTodoById,
      removeMessage,
    };
  },
});
</script>
