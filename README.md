# Wildcard — creative agency website

A loud, big-type website for a creative agency, design studio or freelance collective. Three pages, plain HTML/CSS and a little vanilla JS. No build step, no framework.

## Pages

- `index.html` — hero, showreel block, marquees, studio intro with stats, selected work, services accordion, process, team, testimonial, client list, CTA
- `work.html` — case studies grid with category filters and results
- `contact.html` — project enquiry form (services, budget, message), contact cards, studio clocks

```
assets/css/style.css   all styles (theme tokens at the top)
assets/js/main.js      mobile menu, reveals, work filters, form validation, studio clocks
assets/img/work-*.svg  original case-study artwork (placeholders for your project images)
assets/img/og-image.svg social share image (swap for a 1200x630 PNG/JPG before launch)
```

## Customise

- **Colours and fonts:** edit `:root` at the top of `assets/css/style.css` (`--brand`, `--accent`, `--accent-2`, `--bg`, `--surface`, `--ink`, `--text`, `--muted`, `--radius`, `--font-display`, `--font-body`).
- **Brand name:** search for `data-zt="brandName"` in all three pages. **Headline:** `data-zt="heading"`.
- **Case studies:** replace `assets/img/work-*.svg` with your own images (4:3 works best; the first card on the home page is shown wide). Each case card has a `data-cat` attribute (`branding`, `digital`, `campaign`) used by the filters on `work.html`; rename categories freely as long as the filter buttons match.
- **Showreel:** replace the inline SVG in `.reel` with a `<video>` or an embed.
- **Team:** portraits are illustrated SVGs; swap for photos with `<img>` inside `.portrait`.
- **Clocks:** each `<time data-tz="Europe/London">` shows the live local time for any IANA time zone.

## Forms

The enquiry and newsletter forms are demos (JS prevents submission and shows a message). To make them live:

- **Formspree:** set `action="https://formspree.io/f/your-id"` and remove `data-demo-contact` / `data-demo-form`.
- **Netlify Forms:** add `name="contact" data-netlify="true"` to the `<form>` and remove the demo attribute.

## Fonts

- Syne (Google Fonts, SIL Open Font License)
- Inter (Google Fonts, SIL Open Font License)

## Deploy

- **Netlify Drop:** drag the folder onto https://app.netlify.com/drop
- **GitHub Pages:** push to a repo, then Settings → Pages.
- **Any web host:** upload the files to your public folder.

## Credits and licence

Designed and built by ZumaTools (Novpix LLC). All artwork, client names and people are fictional and original. MIT licence, see `LICENSE`.
