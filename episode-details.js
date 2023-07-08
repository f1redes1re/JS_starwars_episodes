import { loadResourse } from './main.js';

export function openModalWindowOfEpisode() {

  const mainContainer = document.getElementById('mainContainer');
  const episodesLinks = document.querySelectorAll('.episode-link');

  // Создаю переменную для того, чтобы исключить возможность многократного вызова функции
  // в случае, когда ответ на клик не пришел, но клик на ссылку произошел еще раз
  let isProcessing = false;

  episodesLinks.forEach(element => element.addEventListener('click', async function (event) {
    event.preventDefault();

    if (isProcessing) return;
    isProcessing = true;

    document.body.style.cursor = 'progress';

    // history.pushState(null, '', element.getAttribute('href'));
    history.pushState({ page: 'episode', url: element.getAttribute('data-url') }, '', element.getAttribute('href'));

    const modalWindow = document.createElement('div'),
          modalWindowEpisodeHeader = document.createElement('h1'),
          modalWindowBtnBack = document.createElement('button'),
          modalWindowBtnPrevious = document.createElement('button'),
          modalWindowBtnNext = document.createElement('button'),
          modalWindowDescription = document.createElement('p'),
          modalWindowPlanetsHeader = document.createElement('h2'),
          modalWindowPlanetsList = document.createElement('ul'),
          modalWindowRacesHeader = document.createElement('h2'),
          modalWindowRacesList = document.createElement('ul');

    modalWindow.classList.add('container');
    modalWindowEpisodeHeader.classList.add('h1', 'fs-1', 'fw-bold', 'episode-modal-header');
    modalWindowBtnBack.classList.add('btn', 'btn-secondary', 'episode-btn-back');
    modalWindowBtnPrevious.classList.add('btn', 'btn-danger', 'btn-previous');
    modalWindowBtnNext.classList.add('btn', 'btn-success', 'btn-next');
    modalWindowDescription.classList.add('text', 'episode-description');
    modalWindowPlanetsHeader.classList.add('h2', 'fs-2', 'fw-bold', 'planets-header');
    modalWindowPlanetsList.classList.add('list-group', 'planets-list');
    modalWindowRacesHeader.classList.add('h2', 'fs-2', 'fw-bold', 'races-header');
    modalWindowRacesList.classList.add('list-group', 'races-list');

    modalWindow.append(
      modalWindowEpisodeHeader,
      modalWindowBtnBack,
      modalWindowBtnPrevious,
      modalWindowBtnNext,
      modalWindowDescription,
      modalWindowPlanetsHeader,
      modalWindowPlanetsList,
      modalWindowRacesHeader,
      modalWindowRacesList
    );

    modalWindowBtnBack.textContent = 'Back to episodes';
    modalWindowBtnBack.addEventListener('click', () => {
      modalWindow.remove();
      document.querySelectorAll('.episode-link').forEach(element => element.style.display = 'inline-block');
      history.replaceState(null, '', '/js_advanced/14_async-event-loop/');
    });

    modalWindowBtnPrevious.textContent = 'Previous episode';
    modalWindowBtnPrevious.addEventListener('click', async () => {
      const currentEpisodeIndex = sortedEpisodes.findIndex(episode => episode.url === episodeData.url);
      if (currentEpisodeIndex > 0) {
        modalWindow.remove();
        const previousEpisode = sortedEpisodes[currentEpisodeIndex - 1];
        let link = Array.from(episodesLinks).find(el => el.getAttribute('data-url') === previousEpisode.url);
        link.click();
      }
    });

    modalWindowBtnNext.textContent = 'Next episode';
    modalWindowBtnNext.addEventListener('click', async () => {
      const currentEpisodeIndex = sortedEpisodes.findIndex(episode => episode.url === episodeData.url);
      if (currentEpisodeIndex < sortedEpisodes.length - 1) {
        modalWindow.remove();
        const nextEpisode = sortedEpisodes[currentEpisodeIndex + 1];
        let link = Array.from(episodesLinks).find(el => el.getAttribute('data-url') === nextEpisode.url);
        link.click();
      }
    });

    const episodeUrl = element.getAttribute('data-url');
    const episodeData = await loadResourse(episodeUrl);
    const episodes = await loadResourse('https://swapi.dev/api/films/');

    // Сортировка эпизодов по дате выпуска
    const sortedEpisodes = episodes.results.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

    sortedEpisodes.forEach((episode, index) => {
      episode.orderNumber = index + 1;
    });

    const matchingEpisode = sortedEpisodes.find(episode => episode.url === episodeData.url);

    modalWindowEpisodeHeader.textContent = `${episodeData.title} (Episode ${matchingEpisode.orderNumber})`;
    modalWindowDescription.textContent = episodeData.opening_crawl;

    const planetsPromises = episodeData.planets.map(planetUrl => loadResourse(planetUrl));
    const speciesPromises = episodeData.species.map(speciesUrl => loadResourse(speciesUrl));

    const [planets, species] = await Promise.all([
      Promise.all(planetsPromises),
      Promise.all(speciesPromises)
    ]);

    modalWindowPlanetsHeader.textContent = "Planets";
    planets.forEach(planet => {
        const planetItem = document.createElement('li');
        planetItem.classList.add('planet');
        planetItem.textContent = planet.name;
        modalWindowPlanetsList.append(planetItem);
    });

    modalWindowRacesHeader.textContent = "Species";
    species.forEach(specie => {
        const speciesItem = document.createElement('li');
        speciesItem.classList.add('race');
        speciesItem.textContent = specie.name;
        modalWindowRacesList.append(speciesItem);
    });

    mainContainer.append(modalWindow);

    episodesLinks.forEach(element => element.style.display = 'none');

    isProcessing = false;

    document.body.style.cursor = 'default';

  }))
};

window.addEventListener('popstate', (event) => {
  // Если история пуста, то возвращаемся к основному списку эпизодов
  if (event.state === null) {
    document.querySelector('.container').remove();
    document.querySelectorAll('.episode-link').forEach(element => element.style.display = 'inline-block');
  }
  // Если состояние содержит информацию об эпизоде
  else if (event.state.page === 'episode') {
    // Получаем URL эпизода из состояния
    let url = event.state.url;
    // Находим соответствующую ссылку на эпизод
    let link = Array.from(episodesLinks).find(el => el.getAttribute('data-url') === url);
    // Программное "нажатие" на эту ссылку, чтобы загрузить эпизод
    link.click();
  }
});
