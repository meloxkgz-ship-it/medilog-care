# App Store Assets

## Subscription Review

- `subscription-review-premium.png` ist in App Store Connect fuer beide Premium-Abos hochgeladen.
- ASC IDs:
  - Monatlich: `08a3e396-70c9-4e26-b733-23fbaa114c10`
  - Jaehrlich: `b014fec3-728b-4737-a79d-906add98f876`

## iPhone Screenshots

Reproduzierbare iPhone-6.5-Zoll-Screenshots erzeugen:

```sh
node scripts/capture-app-store-screenshots.mjs
```

Zielordner:

```text
ios/MediLogNative/AppStoreAssets/iphone-65/
```

Die erzeugten PNGs sind `1284x2778` und passen zu `APP_IPHONE_65`.

Der aktuelle iPhone-6.5-Screenshot-Satz wurde in App Store Connect hochgeladen:

- Screenshot Set ID: `240d6303-3855-4607-904e-796e030dbf16`
- `01-home.png`: `675a9d5f-a6af-46c6-b5fc-8234057ece15`
- `02-plaene.png`: `945c7bdc-33c7-481a-a7af-c8cde24a6a46`
- `03-medis.png`: `e92c8413-6099-478b-bd1f-d5c6247b8b31`
- `04-verlauf.png`: `9598b71f-de2d-4713-b309-076c11b42959`
- `05-premium.png`: `a732d43b-5f8a-4a8c-ab69-2ccb1f39b83e`
