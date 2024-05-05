# Geschichtswanderung in Friedrichssegen

Dieses Projekt stellt eine Web-Anwendung "Explorer App" bereit,
mit der auf mobilen Endgeräten ein Wanderweg entlang historischer
Höhepunkte auf verschiedenen Karten darstellt.

## Nutzung

Die Anwendung ist webbasiert mit der Besonderheit, dass eine lokale Installation
auf mobilen Endgeräten möglich ist.

Eine produktive Version der Anwendung läuft auf der Infrastruktur der
movisda GmbH und ist über die URL

https://viriditas.geomap.de/friedrichssegen.app

aufrufbar. Eine Entwickerversion zum Testen neuer Funktionen oder Daten
wird unter

https://viriditas.geomap.de/friedrichssegen.app

bereitgestellt.

## Installation

Die aktuelle Version der "Explorer App" für Friedrichssegen kann über folgende
URL heruntergeladen werden:

https://viriditas.geomap.de/friedrichssegen.dev/download/friedrichssegen.app-0.9.6.zip

Für die Installation muss man dieses Archiv in ein Verzeichnis entpacken,
welches durch einen Webserver zugreifbar ist.

## Datenquellen

Aktuell werden drei verschiedene Datenquellen unterstützt:

- Bilddateien
- OSM Rasterkarten
- [GeoJSON][geojson-org] Daten

Die Konfiguration der Basiskarten bzw. der zusätzlichen Kartenebenen
erfolgt durchweg in der Datei [js/maps.js][maps-js]. Darin gibt es jeweils
einen Abschnitt für die einzelnen Datequellen

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

Alle konfigurierten Karten tauchen auch automatisch in der Ebenenübersicht
der Anwendung auf. Die Sortiertung erfolgt mit aufsteigendem "Alter" getrennt
für die Basiskarten und die Overlays. Dieser Wert ist in allen
Ebenenkonigurationen über `options/age` definierbar.

Es gibt noch zwei weitere Konfigurationsparameter, die für alle Ebenen gleich
sind:

- `name`: Dieser Wert dient zur Darstellung in der Ebenenübersicht in der App
- `url`: Das ist der Verweis auf die Datei mit den Daten.
  In der aktuellen Konfiguration liegen alle Daten im `data`-Verzeichnis.
  Es ist aber nicht zwingend, vereinfacht aber die Übersicht.

Die speziellen Konfigurationen der einzelnen Quellen erfolgt in den
nachfolgenden Abschnitten.

### Bilddatei

Bilder als Hintergrundkarten müssen in die Grundkarte eingepasst werden.
Das kann aktuell auf zwei Arten geschehen:

- Georeferenzierung der Bildeckpunkte
- ESRI World Datei

Bei der Eckpunktreferenzierung wird auf auf das geodätische Referenzsystem
**WGS 84** gesetzt. Die erste Koordinate gibt die Position des
Bildpunkts links unten an, während die zweite Koordinate den rechten
oberen Bildpunkt auf der Erde verortet.

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

Die Konfiguration des Mappings über ESRI World Datei erfordert die Angabe
des Pfades zur `jgw`-Datei. Diese Textdatei enthält die Referenzkoordinaten
für die entsprechende Rasterdatei.

Zudem ist noch das Referenzsystem der Koordinaten anzugegen, auf das sich
die ESRI World Mapping bezieht. Aktuell wird in diesem Projekt nur die
UTM-Projektion unterstützt. Der Wert des Paramenter `proj` muss somit immer
`UTM` lauten.

Variabel hingengen ist die Angabe der Zone und des Bandes. Das Band bestimmt
die Lage auf der nördlichen (`N`) oder südlichen (`S`) Hemisphäre.

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

### OSM Rasterkarte

Für Hintergrundkarten, die mehrere Zoomstufen unterstützen, bieten sich
"PMTiles" an. Dabei handelt es sich um ein spezielles Dateiformat,
das eine in Kacheln unterteilte Karte einer Darstellungskomponente
zur Verfügung stellen kann.

In diesem Projekt wird mit dieser Technologie eine aktuelle Karte aus
dem freien Kartenprojekt [OpenStreetMap][osm-url] bereitgestellt.
Ein Weg zur Erzeugung einer derartigen Karte ist die Nutzung von QGIS
mit der Möglichkeit der Generierung von XYZ Kacheln (MBTiles).
Dieser [Artikel][mbtiles-qgis] beschreibt diesen Weg und soll an dieser
Stelle nicht weiter ausgeführt werden.

Diese so generierte Datei ist letztlich eine speziell aufbereitete
[SQLite-Datenbank][mbtiles-url]. Sie eignet sich gut für Server-basierte
Anwendungen doch weniger für den Betrieb auf mobilen Endgeräten.
Deshalb wird noch eine Umwandlung in das [PMTiles-Format][protomap-url]
mit Hilfe des Werkzeugs [pmtiles][pmtiles-cli] vornommen.

Wie die nachfolgende Beispielkonfiguration zeigt, sind keine weiteren
Parameter für die Einbindung dieser Kartenebene notwendig.

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

Dieser Ebenentyp eignet sich vor allem für die Einbindung von vektorbasierten
Geoinformationen. [GeoJSON][geojson] ist ein offenes Format zur Darstellung
von Geodaten nach der Simple Feature Access Spezifikation, welches u.a. die
Beschreibung von Punkt, Linien und Flächenelementen mit entsprechenden
Attributen ermöglicht. Dazu wird die JavaScript Object Notation verwendet.

Wie auch bei der OSM Rasterkarte benötigt diese Kartenebene aktuell keine
weiteren Angaben. Die notwendigen Informationen für die Darstellung der
einzelnen Elemente erfolgt direkt in der GeoJSON-Datei.

```json
{
  "name": "Touristenroute",
  "url": "data/overlays/Touristenroute.geojson",
  "options": {
    "age": 1
  }
}
```

Die Grundstruktur einer Ebene auf Basis des GeoJSON-Format sieht folgendermaßen
aus:

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

Alle Darstellungselemente werden in dem Bereich "features" angegeben. In
diesem Projekt werden drei Punkt-Featuretypen unterstützt, die sich in
der Art des angezeigten Popups unterscheiden:

- Bilder
- PDF-Datei
- Video

In allen Fällen ist eine Geometrie in Form eines Punktes mit WGS84-Koordinaten
anzugeben. Der Wert des Attributs `Objekt` bestimmt den Namen, wie er in dem
Popup angezeigt wird. Die Angabe von `Id` ist optional und wird zur Zeit
nicht weiter verwendet.

Sobald das Attribute `Bilder` existiert und mit einer Liste von
Bilddateinamen gefüllt ist, wird automatisch eine Bildergalerie als Popup
angezeigt.

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

Die Existenz des Attributs `PDF` erzeugt ein Popup, welches die angegebene
PDF-Datei darstellt. Es kann nur eine Datei angegeben werden.

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

Schließlich erlaubt das Attribut `Video` das automatische Abspielen eines
Videos im Popup. Auch hier kann genau eine Datei angeegeben werden.

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

### Verwendete Softwarekomponenten

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
