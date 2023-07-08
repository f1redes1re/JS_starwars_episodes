// Инициализация ссылки на сервер
const STARWARS_URL = 'https://swapi.dev';

const cssPromises = {};

export async function loadResourse(src) {
  if (src.endsWith('.js')) {
    return import(src);
  }

  if (src.endsWith('.css')) {
    if (!cssPromises[src]) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = src;
      cssPromises[src] = new Promise(resolve => {
        link.addEventListener('load', () => resolve());
      });
      document.head.append(link);
    }
    return cssPromises[src];
  }

  return fetch(src).then(res => res.json());
};

document.addEventListener('DOMContentLoaded', async () => {

  async function renderEpisodesTitles(path, renderFn) {
    let renderPath = await loadResourse(path);
    const module = await import(renderFn);
    module.render(renderPath);
  };

  const resources = [
    loadResourse('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'),
    loadResourse('https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.js'),
    loadResourse('./css/style.css'),
    loadResourse('./css/media.css'),
    loadResourse('./sketch.js'),
    renderEpisodesTitles('https://swapi.dev/api/films/', './episodes-list.js'),
  ];

  await Promise.all(resources);

  const { openModalWindowOfEpisode } = await loadResourse('./episode-details.js');
  openModalWindowOfEpisode();
});
