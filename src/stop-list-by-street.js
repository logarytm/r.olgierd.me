import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

const hx = hyperx(hyperscript);

function toggleStreet(e) {
  const street = e.target.parentNode.querySelector('.stops__per-street-list');
  street.classList.toggle('u-visually-hidden');
}

export default function StopListByStreet(streets) {
  const html = hx`
    <ul>
      ${streets.map((street, index) => hx`
        <li>
          <button class="stops__street-name" type="button">${street.name}</button>
          <ul class="stops__per-street-list" data-street-index="${index}">
            ${street.stops.map(stop => hx`
              <li><a href="/stops/${stop.id}">${stop.name}</a></li>
            `)}
          </ul>
        </li>`,
      )}
    </ul>
  `;

  html.addEventListener('click', function onClick(e) {
    if (e.target.matches('.stops__street-name')) {
      return toggleStreet(e);
    }

    return true;
  });

  return html;
}
