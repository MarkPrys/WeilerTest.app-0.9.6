# Історична прогулянка Фрідріхсзегеном

Цей проект надає веб-додаток "Explorer App", який відображає пішохідний маршрут вздовж історичних пам'яток на різних картах на мобільних пристроях.

## Використання

Додаток є веб-орієнтованим, але його особливістю є можливість локальної установки на мобільні пристрої.

Продуктивна версія програми працює на інфраструктурі movisda GmbH і доступна за посиланням

https://viriditas.geomap.de/friedrichssegen.app

. Версія для розробників для тестування нових функцій або даних
доступна за адресою

https://viriditas.geomap.de/friedrichssegen.app

надається.

## Installation

Поточну версію "Explorer App" для Фрідріхсзегена можна завантажити за наступним посиланням
URL:

https://viriditas.geomap.de/friedrichssegen.dev/download/friedrichssegen.app-0.9.6.zip

Для встановлення вам потрібно розпакувати цей архів у каталог,
до якої є доступ через веб-сервер.

## Джерела даних

Наразі підтримуються три різні джерела даних:

- Файли зображень
- Растрові карти OSM
-[GeoJSON][geojson-org] дані

Конфігурація базових карт і додаткових шарів карти
завжди виконується у файлі [js/maps.js][maps-js]. У цьому файлі є секція для кожного окремого файлу-джерела

```json
const LAYERS = {
  /* base maps as image */
  images: [
  ],
  /* OSM Rasterkarten */
  pmtiles: [
  ],
  /* GeoJSON overlays */
  geojson: [
  ],
};

```

Всі налаштовані картки також автоматично з'являються в огляді шарів програми. Вони відсортовані окремо для базових карт і для накладених у порядку зростання "віку". Це значення можна визначити у всіх конфігураціях шарів через `options/age`.

Є ще два параметри конфігурації, які є однаковими для всіх рівнів:

- `name`: Це значення використовується для відображення в огляді шару в додатку
- `url`: Це посилання на файл з даними.
  У поточній конфігурації всі дані знаходяться в каталозі `data`.
  Однак це не є обов'язковим, але спрощує огляд.


Спеціальні конфігурації окремих джерел описані в наступних розділах.

### Файл зображення

Зображення як фонові карти мають бути вписані в базову карту.
Наразі це можна зробити двома способами:

- Прив'язка вершин растра до місцевості
- Файл ESRI World

Прив'язка кутових точок базується на геодезичній системі відліку
використовується **WGS 84**. Перша координата вказує на положення
лівого нижнього кута зображення, тоді як друга координата визначає положення правого верхнього пікселя на місцевості.

```json
{
  "name": "Tranchot - v. Müffling 1803-1820",
  "url": "data/maps/tranchot.png",
  "bounds": [
    [50.29068795494675, 7.6328987132876716],
    [50.321764254593674, 7.705471469491065]
  ],
  "options": {
    "age": 1820
  }
}
```

Конфігурація прив'язки через файл ESRI World вимагає вказівки
шляху до файлу `jgw`. Цей текстовий файл містить опорні координати
для відповідного растрового файлу.

Крім того, необхідно враховувати систему координат, на яку посилається ESRI World Mapping. Наразі у цьому проекті підтримується лише проекція UTM. Тому значення параметра `proj` завжди має бути `UTM`.

Специфікація зони та діапазону є змінною. Смуга визначає
розташування в північній (`N`) або південній (`S`) півкулі.

```json
{
  "name": "TK25 2023",
  "url": "data/maps/Friedrichssegen_TK25_Uebersicht.jpg",
  "world": {
    "file": "data/maps/Friedrichssegen_TK25_Uebersicht.jgw",
    "proj": "UTM",
    "zone": 32,
    "band": "N"
  },
  "options": {
    "age": 2023
  }
}
```

### Растрова карта OSM

PMTiles" ідеально підходять для фонових карт, які підтримують кілька рівнів масштабування. Це спеціальний формат файлів,
який може забезпечити компонент відображення з мапою, розділеною на плитки.

Цей проект використовує цю технологію для надання актуальної карти з
вільного картографічного проекту [OpenStreetMap][osm-url].
Одним із способів створення такої карти є використання QGIS з можливістю генерації XYZ плиток (MBTiles).
Ця [Artikel][mbtiles-qgis] описує цей метод і не буде пояснюватися тут далі.

Цей згенерований файл в кінцевому підсумку є спеціально підготовленою [базою даних SQLite][mbtiles-url]. Він добре підходить для серверних додатків, але менш придатний для роботи на мобільних пристроях.
З цієї причини він конвертується у формат [PMTiles][protomap-url] за допомогою інструменту [pmtiles][pmtiles-cli].

Як показано в наступному прикладі конфігурації, для інтеграції цього рівня карти не потрібно ніяких додаткових параметрів.

```json
{
  "name": "OpenStreetMap 04/2024",
  "url": "data/maps/OpenStreetMap.pmtiles",
  "options": {
    "age": 2024
  }
}
```

### GeoJSON

Цей тип шару особливо підходить для інтеграції векторної геоінформації. [GeoJSON][geojson] - це відкритий формат для візуалізації геоданих відповідно до Simple Feature Access Specification, який дозволяє описувати елементи точок, ліній та площ з відповідними атрибутами, серед іншого. Для цього використовується JavaScript Object Notation.

Як і у випадку з растровою картою OSM, цей шар карти наразі не потребує додаткової інформації. Інформація, необхідна для відображення окремих елементів, міститься безпосередньо у файлі GeoJSON.

```json
{
  "name": "Touristenroute",
  "url": "data/overlays/Touristenroute.geojson",
  "options": {
    "age": 1
  }
}
```

Базова структура шару на основі формату GeoJSON виглядає наступним чином:

```json

{
  "type": "FeatureCollection",
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
    }
  },
  "features": [
    ...
  ]
}
```

Всі елементи відображення вказуються в області "features". У цьому проекті підтримуються три типи елементів, які відрізняються типом спливаючого вікна, що відображається:

- Bilder (зображення)
- PDF-Datei
- Video

У всіх випадках має бути вказана геометрія у вигляді точки з координатами WGS84. Значення атрибуту "Objekt" визначає назву, яка відображатиметься у спливаючому вікні. Специфікація `Id` є необов'язковою і наразі більше не використовується.

Як тільки атрибут "Bilder" існує і заповнений списком імен файлів зображень, галерея зображень автоматично відображається у спливаючому вікні.

```json
{
  "type": "Feature",
  "properties": {
    "Id": 17,
    "Objekt": "Schule am Tagschacht",
    "Bilder": ["./data/Bilder/image/schule_am_Tagschacht1.jpg", "./data/Bilder/image/schule_am_Tagschacht2.jpg"]
  },
  "geometry": {
    "type": "Point",
    "coordinates": [7.862, 49.949]
  }
}
```

Наявність атрибута `PDF` генерує спливаюче вікно, в якому відображається вказаний файл PDF. Можна вказати лише один файл.

```json
{
  "type": "Feature",
  "properties": {
    "Id": 42,
    "Objekt": "Tagschacht",
    "PDF": ["./data/content/pdf/FS_Tagschacht.pdf"]
  },
  "geometry": {
    "type": "Point",
    "coordinates": [7.871, 49.959]
  }
},
```

Нарешті, атрибут "Відео" дозволяє автоматично відтворювати відео у спливаючому вікні. Тут також можна вказати лише один файл.

```json
{
  "type": "Feature",
  "properties": {
    "Id": 42,
    "Objekt": "Hubertusviadukt",
    "Video": ["./data/content/video/Hubertusviadukt_compressed_cutted.webm"]
  },
  "geometry": {
    "type": "Point",
    "coordinates": [7.865, 49.957]
  }
}
```

### Використані програмні компоненти

- [Leaflet JS][leaflet-url]
- [Leaflet Responsive Popup][responsive-popup]
- [Leaflet Locate Control][leaflet-locate-url]
- [PMTiles][protomap-url]
- [LocalForage][localforage-url]
- [Workbox][workbox-url]
- [SweetAlert 2][sweetalert-url]
- [IcoMoon][icomoon-url]
- [PDF JS][pdfjs-url]

[geojson-org]: https://geojson.org/
[leaflet-url]: https://leafletjs.com/
[leaflet-locate-url]: https://github.com/domoritz/leaflet-locatecontrol
[localforage-url]: https://localforage.github.io/localForage/
[maps-js]: https://viriditas.geomap.de/friedrichssegen.dev/js/maps.js
[mbtiles-qgis]: https://mapscaping.com/mbtiles-in-qgis/
[mbtiles-url]: https://wiki.openstreetmap.org/wiki/MBTiles
[osm-url]: https://openstreetmap.org
[pmtiles-cli]: https://docs.protomaps.com/pmtiles/cli
[pdfjs-url]: https://mozilla.github.io/pdf.js/#
[protomap-url]: https://docs.protomaps.com/pmtiles/
[sweetalert-url]: https://sweetalert2.github.io/
[workbox-url]: https://github.com/GoogleChrome/workbox/
[icomoon-url]: https://icomoon.io/'
[responsive-popup]: https://github.com/yafred/leaflet-responsive-popup
