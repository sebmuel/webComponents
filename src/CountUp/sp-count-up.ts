import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import Swiper from "swiper";

interface Option {
  [key: string]: string;
}

/***
 * TODO: 
 * 1. Change the public API to recive an start and end object instead of the array approach
 * 2. When toggling make it so that the "year" gets a class to the highlight that it is active
 * 3. Define Styling variables to expose to the public API
 * 4. The Option object should have a direction that determines the vertical direction (up, down) when toggling
 */

@customElement("sp-count-up")
export class DigitSlider extends LitElement {
  @property({ type: Number }) size: number = 60;
  @property({ type: Array }) options: Option[] = [];

  private digits = [0,1,2,3,4,5,6,7,8,9];
  private sliders: Swiper[] = [];

  static styles = css`
    :host {
      font-family: var(--sp-count-font);
    }

    .root {
      width: fit-content;
    }

    .numbers {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .year{
      color: var(--sp-year-color, #fff)
    }

    .toggles {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }

    .toggles > div {
      font-weight: 200;
    }

    .toggle-indicator {
      position: absolute;
      height: 20px;
      transform: translate(0, -50%);
      left: -1px;
      width: 5px;
      background-color: var(--sp-toggle-border-color, #fff);
      transition: left 0.8s ease-in-out;
    }

    .toggle-indicator.toggled {
      left: 100%;
    }

    .swiper {
      overflow: hidden;
    }

    .toggle-border {
      margin: 0 10px;
      position: relative;
      height: 0;
      background: transparent;
      width: 100%;
      border: 1px dashed var(--sp-toggle-border-color, #fff);
    }

    .swiper-slide, .decimal-seperator{
      color: var(--sp-count-color, #fff);
    }

    .swiper-slide {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 80px;
      font-weight: 600;
    }
  `;

  firstUpdated() {
    this.initSwipers();
  }

  private initSwipers(): void {
    const startMap = this.getNumberAsArray(0);
    this.renderRoot.querySelectorAll(".count-up").forEach((e, i) => {
      const swiper = new Swiper(e as HTMLElement, {
        direction: "vertical",
        loop: true,
        initialSlide: startMap[i],
        allowTouchMove: false
      });
      this.sliders.push(swiper);
    });
  }

  private getNumberLength(): number {
    return this.options.reduce((max, obj) => {
      return Math.max(max, Object.values(obj)[0].length);
    }, 0);
  }

  private getNumberAsArray(index: number): number[] {
    return Array.from(Object.values(this.options[index])[0]).map((n) =>
      Number.parseInt(n)
    );
  }

  private toggleNumber(): void {
    const toggleBar = this.renderRoot.querySelector(".toggle-indicator");
    const isToggled = toggleBar?.classList.contains("toggled");

    if (toggleBar) {
      toggleBar.classList.toggle("toggled");
    }

    const direction = isToggled ? 0 : 1;

    this.slideToNumber(direction);
  }

  private slideToNumber(direction: number): void {
    const map = this.getNumberAsArray(direction);
    this.sliders.forEach((s, i) => {
      const slideIndex = s.slides.findIndex(
        (slide) => Number.parseInt(slide.dataset.value!) === map[i]
      );
      s.slideTo(slideIndex, 1500);
    });
  }

  private renderSlider(i: number): any {
    return html`
      ${(this.getNumberLength() - i) % 3 === 0 && i > 0
        ? html`<span class="decimal-seperator" style="font-size: ${this.size}px">.</span>`
        : null}
      <div class="swiper count-up" style="height:${this.size}px">
        <div class="swiper-wrapper">
          ${this.digits.map((n) => {
            return html`<div
              class="swiper-slide"
              data-value=${n}
              style="font-size: ${this.size}px"
            >
              ${n}
            </div>`;
          })}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="root">
        <div class="numbers">
          ${Array(this.getNumberLength())
            .fill(0)
            .map((_, i) => this.renderSlider(i))}
        </div>
        <div class="toggles" @click=${this.toggleNumber}>
          ${this.options.map((o, i) => {
            return html`
              <div class="year" style="font-size: ${this.size / 4}px">
                ${Object.keys(o)[0]}
              </div>
              ${i % 2 === 0
                ? html`
                    <span class="toggle-border">
                      <span class="toggle-indicator"></span>
                    </span>
                  `
                : null}
            `;
          })}
        </div>
      </div>
    `;
  }
}
