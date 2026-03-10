<template>
  <div style="max-width: 900px; margin: 40px auto; font-family: system-ui, sans-serif">
    <h2>Splitter v-if Panel — Layout Shift Bug</h2>

    <p style="margin-bottom: 8px">
      Panel 2 appears after <strong>{{ DELAY_MS }}ms</strong> (simulating async data load).
      <br />
      Watch the right panel — it starts at ~0px then shifts to 40%.
    </p>

    <div
      style="
        padding: 8px 12px;
        margin-bottom: 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
      "
      :style="{
        background: showSecondPanel ? '#dcfce7' : '#fef9c3',
        color: showSecondPanel ? '#166534' : '#854d0e',
      }"
    >
      {{ showSecondPanel ? 'Panel 2 visible — observe width below' : 'Waiting for async data...' }}
    </div>

    <Splitter style="height: 300px; border: 1px solid #e2e8f0; border-radius: 8px">
      <SplitterPanel :size="60" :min-size="20">
        <div style="padding: 24px">
          <h3 style="margin: 0 0 8px">Panel 1 (size=60)</h3>
          <p style="margin: 0; color: #64748b">Main content area</p>
        </div>
      </SplitterPanel>
      <SplitterPanel v-if="showSecondPanel" :size="40" :min-size="20">
        <div style="padding: 24px">
          <h3 style="margin: 0 0 8px">Panel 2 (size=40)</h3>
          <p style="margin: 0; color: #64748b">
            Dynamic panel — appeared after {{ DELAY_MS }}ms
          </p>
          <p style="margin: 8px 0 0; font-size: 13px; color: #94a3b8">
            Current width: <strong>{{ panelWidth }}px</strong>
          </p>
        </div>
      </SplitterPanel>
    </Splitter>

    <div style="margin-top: 16px; font-size: 13px; color: #64748b">
      <strong>Width history:</strong>
      <ul style="margin: 4px 0; padding-left: 20px">
        <li v-for="(entry, index) in widthHistory" :key="index">
          +{{ entry.time }}ms → <strong>{{ entry.width }}px</strong>
          <span v-if="index > 0 && Math.abs(entry.width - widthHistory[index - 1].width) > 2" style="color: #dc2626">
            (shifted {{ Math.round(entry.width - widthHistory[index - 1].width) }}px)
          </span>
        </li>
        <li v-if="!widthHistory.length" style="color: #94a3b8">Panel not visible yet</li>
      </ul>
    </div>

    <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; font-size: 13px">
      <strong>How to fix:</strong> Open <code>src/main.js</code> and change
      <code>APPLY_PATCH</code> from <code>false</code> to <code>true</code>.
      The panel will then appear at the correct 40% width immediately, with no layout shift.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const DELAY_MS = 1500;
const showSecondPanel = ref(false);
const panelWidth = ref(0);
const widthHistory = ref([]);

let resizeObserver = null;
let startTime = 0;

const trackPanel = () => {
  const panels = document.querySelectorAll('.p-splitterpanel');
  const secondPanel = panels[1];

  if (!secondPanel) return;

  let lastWidth = 0;

  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const width = Math.round(entry.contentRect.width * 100) / 100;

      if (Math.abs(width - lastWidth) > 0.5) {
        panelWidth.value = width;
        widthHistory.value.push({
          time: Date.now() - startTime,
          width,
        });
        lastWidth = width;
      }
    }
  });

  resizeObserver.observe(secondPanel);
};

onMounted(() => {
  startTime = Date.now();

  setTimeout(() => {
    showSecondPanel.value = true;
    nextTick(() => trackPanel());
  }, DELAY_MS);
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>
