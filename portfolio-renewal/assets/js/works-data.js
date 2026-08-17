// assets/js/works-data.js

export let worksData = [];

export async function loadWorksData() {
  if (worksData.length > 0) return worksData;
  try {
    const res = await fetch('/content/projects.json');
    if (!res.ok) throw new Error('Failed to load projects.json');
    const data = await res.json();
    worksData = data.projects || [];
    return worksData;
  } catch (error) {
    console.error('Error loading works data:', error);
    return [];
  }
}
