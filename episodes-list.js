export function render(episodes) {

  // Сортировка эпизодов по дате выпуска
  const sortedEpisodes = episodes.results.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

  sortedEpisodes.forEach((episode, index) => {
    episode.orderNumber = index + 1;
  });

  const container = document.createElement('div');
  container.classList.add(
    'container',
    'd-flex',
    'flex-wrap',
    'py-4'
  );
  container.id = 'mainContainer';
  document.body.append(container);

  for (const episode of sortedEpisodes) {

    if (episode.orderNumber === 1) {
      episode.orderNumber = 'I'
    } else if (episode.orderNumber === 2) {
      episode.orderNumber = 'II'
    } else if (episode.orderNumber === 3) {
      episode.orderNumber = 'III'
    } else if (episode.orderNumber === 4) {
      episode.orderNumber = 'IV'
    } else if (episode.orderNumber === 5) {
      episode.orderNumber = 'V'
    } else if (episode.orderNumber === 6) {
      episode.orderNumber = 'VI'
    }

    const episodeTitle = document.createElement('a');
    episodeTitle.href = '#'
    episodeTitle.classList.add(
      'episode-link',
      'link-dark',
      'link-offset-2',
      'link-underline-opacity-25',
      'link-underline-opacity-100-hover'
    );
    episodeTitle.textContent = `${episode.orderNumber}. ${episode.title}`;
    episodeTitle.href = `#/episode/${episode.orderNumber}`
    episodeTitle.setAttribute('data-url', episode.url);
    container.append(episodeTitle);
  };

};
