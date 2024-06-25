<script setup>

import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

import { api } from '@/modules/axios-config';

import SectionHeader from '@/components/SectionHeader.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import Loader from '@/components/LoaderWithText.vue';
import Search from '@/components/SearchForm.vue';
import NotFound from '@/components/NotFound.vue';
import UsersList from '@/components/UsersList.vue';
import UserCreateModal from '@/components/UserCreateModal.vue';

import emitter from '@/modules/eventBus.js';

const isLoading = ref(false);

const users = ref([]);

const display = ref(false);

const page = ref(1);
const count = ref();

const pages = computed(() => {
  return Math.ceil(count.value / 10);
});

const showMore = (e) => {
  console.log(e)
  if (e > pages.value) {
    return;
  }

  if (e <= pages.value) {
    page.value = e;
  }
};

const showModal = () => {
  display.value = !display.value;
};

const closeModal = (e) => {
  display.value = e;
};

const fetchUsers = async (page = 1) => {
  try {
    isLoading.value = true;
    const response = await api.get(`/auth/users/?page=${page}`);
    return response.data;
  } catch (error) {
    isLoading.value = false;
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = async (query) => {
  try {
    isLoading.value = true;
    if (!query) {
      const response = await fetchUsers();
      users.value = removeDuplicates(response.results);
    } else {
      const response = await api.get(`/auth/users/?name=${query}`);
      users.value = removeDuplicates(response.data.results);
    }
  } catch (error) {
    console.error('Failed to search users:', error);
  } finally {
    isLoading.value = false;
  }
};

const clearSearch = () => { handleSearch(''); };

const removeDuplicates = (array) => {
  const seen = new Set();
  return array.filter(item => {
    const isDuplicate = seen.has(item.id);
    seen.add(item.id);
    return !isDuplicate;
  });
};

watch(page, async (nextPage) => {
  if (nextPage > pages.value) {
    return;
  }

  const response = await fetchUsers(nextPage);
  const uniqueUsers = removeDuplicates(users.value.concat(response.results));
  users.value = uniqueUsers;
});

onMounted(() => {
  fetchUsers().then(usersData => {
    users.value = removeDuplicates(usersData.results);
    count.value = usersData.count;
  });
  emitter.on('userUpdated', () => {
    page.value = 1;
    fetchUsers().then(usersData => {
      users.value = removeDuplicates(usersData.results);
      count.value = usersData.count;
    });
  });
  emitter.on('userAdded', () => {
    page.value = 1;
    fetchUsers().then(usersData => {
      users.value = removeDuplicates(usersData.results);
      count.value = usersData.count;
    });
  });
  emitter.on('updateCoursesList', () => {
    page.value = 1;
    fetchUsers().then(usersData => {
      users.value = removeDuplicates(usersData.results);
      count.value = usersData.count;
    });
  });
});

onUnmounted(() => {
  emitter.off('userUpdated', fetchUsers);
  emitter.off('userAdded', fetchUsers);
  emitter.off('updateCoursesList', fetchUsers);
});
</script>

<template>
    <div class="relative">
      <UserCreateModal v-if="display" @close-modal="closeModal" />
    </div>
    <transition>
        <loader v-if="isLoading" :fullscreen="true" :should-catch-focus="true">
            <template #default>
                <div class="w-96">
                    <p class="pb-4 text-2xl font-normal text-gray-700">Загрузка</p>
                    <p class="text-base font-normal text-gray-700">
                        Загружаем список пользователей. Это может занять некоторое время.
                        Пожалуйста, подождите немного.
                    </p>
                </div>
            </template>
        </loader>
    </transition>
    <div class="h-full flex flex-col">
        <section-header icon="/sprite.svg#icon-users" title="Пользователи">
            <template v-slot:search>
                <search @search="handleSearch" @clear="clearSearch"></search>
            </template>
            <div>
                <div class="w-72 mr-1">
                    <ButtonComponent :label="'Новый пользователь'" :icon="'/sprite.svg#icon-add-user'"
                        @click.prevent="showModal">
                    </ButtonComponent>
                </div>
            </div>
        </section-header>
        <not-found
          v-if="!isLoading"
          :items="users"
          type="users">
        </not-found>
        <UsersList
          @show-more="showMore"
          :page="page"
          :pages="pages"
          :users="users"
        />
    </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>