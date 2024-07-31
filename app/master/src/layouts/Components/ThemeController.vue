<script setup lang="ts">
import refresh from '@assets/icon/icon_refresh.svg';

const props = defineProps<{
  isCompactMenu: boolean,
  changeTheme: (theme: string) => void,
}>();

const themeList = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
];

</script>

<template>
  <label
    for="my-modal"
    class="!active:bg-[red] btn p-0 text-[1.40625vw] text-white"
  >
    <img
      v-if="props.isCompactMenu"
      :src="refresh"
      alt="refresh_icon"
      class="w-5/6 max-w-none"
    />
    <span v-else>테마변경</span>
  </label>

  <teleport to="body">
    <input
      id="my-modal"
      type="checkbox"
      class="modal-toggle"
    />
    <label
      for="my-modal"
      class="modal cursor-pointer"
    >
      <label
        class="modal-box relative max-w-[70rem]"
        for="s"
        aria-label="modal"
      >
        <label
          for="my-modal"
          class="btn-sm btn-circle btn absolute right-6 top-6"
        >
          ✕
        </label>
        <h3 class="text-lg font-bold">
          테마를 선택해주세요.
        </h3>
        <p class="py-4">
          골라골라
        </p>
        <div
          class="grid grid-cols-4 gap-3 p-3"
          tabindex="0"
        >
          <button
            v-for="(list, i) in themeList"
            :key="i"
            type="button"
            class="outline-base-content overflow-hidden rounded-lg text-left"
            :data-set-theme="list"
            data-act-class="[&amp;_svg]:visible"
            @click="props.changeTheme(list)"
          >
            <div
              :data-theme="list"
              class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
            >
              <div class="grid grid-cols-5 grid-rows-3">
                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="invisible size-3"
                  >
                    <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                  </svg>
                  <div class="grow text-sm font-bold">
                    {{ list }}
                  </div>
                  <div class="flex h-full shrink-0 flex-wrap gap-1">
                    <div class="bg-primary w-2 rounded"></div>
                    <div class="bg-secondary w-2 rounded"></div>
                    <div class="bg-accent w-2 rounded"></div>
                    <div class="bg-neutral w-2 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </label>
    </label>
  </teleport>
</template>
