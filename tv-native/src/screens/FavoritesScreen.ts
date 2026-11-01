/** Favoritos: canais e títulos marcados, nas mesmas fileiras do Início. */

import { Rail } from '../components/Rail';
import { SpatialNav } from '../core/SpatialNav';
import { Storage } from '../core/Storage';
import { Api } from '../core/Api';
import { State } from '../core/State';

export class FavoritesScreen {
  private element: HTMLElement;
  private vazio: HTMLElement;
  private conta: HTMLElement;
  private fileiras: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'tv-screen tv-favoritos hidden';
    this.element.id = 'screen-favorites';
    this.element.innerHTML = `
      <div class="tv-fav-titulo">Favoritos <span id="fav-conta"></span></div>
      <div class="tv-fav-vazio" id="fav-vazio">Nada nos favoritos ainda.<br />Abra um título e use o botão Favoritar.</div>
      <div class="tv-screen-scroll tv-scroll-v" id="fav-fileiras"></div>
    `;
    this.vazio = this.element.querySelector('#fav-vazio')!;
    this.conta = this.element.querySelector('#fav-conta')!;
    this.fileiras = this.element.querySelector('#fav-fileiras')!;
  }

  getElement(): HTMLElement {
    return this.element;
  }

  enter() {
    this.element.classList.remove('hidden');
    this.fileiras.innerHTML = '';
    const canais = State.channels.filter((c) => Storage.getFavoriteChannels().has(c.name));
    const titulos = Api.getSearchPool().filter((v) => Storage.getFavoriteVOD().has(v.title));
    const total = canais.length + titulos.length;
    this.conta.textContent = `${total} títulos`;
    this.vazio.classList.toggle('hidden', total > 0);

    if (canais.length) {
      const r = new Rail('Canais', true);
      r.setCards(canais.map((c) => ({ id: `fav-${c.id}`, title: c.name, image: c.logo, onClick: () => State.setScreen('live', { channel: c }) })));
      this.fileiras.appendChild(r.getElement());
    }
    if (titulos.length) {
      const r = new Rail('Filmes e séries');
      r.setCards(titulos.map((v) => ({ id: `fav-${v.id}`, title: v.title, image: v.poster, onClick: () => State.setScreen('ficha', { vod: v }) })));
      this.fileiras.appendChild(r.getElement());
    }
    const primeiro = this.fileiras.querySelector<HTMLElement>('.tv-card');
    if (primeiro) SpatialNav.focus(primeiro);
  }

  leave() {
    this.element.classList.add('hidden');
  }
}
