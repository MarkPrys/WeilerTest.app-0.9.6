/************************************************************ -*- JavaScript -*-
 *
 * (c) 2024 movisda GmbH
 *
 * movisda GmbH
 * Rosenstr. 2
 * 10178 Berlin
 * Germany
 *
 * email:   dev@movisda.io
 * web:     https://movisda.io
 *
 * The software and documentation contained herein are proprietary to and
 * comprise valuable trade secrets of movisda GmbH which intends to preserve.
 *
 * This software may not be used, copied, transmitted, stored, modified,
 * distributed or sold without a written license agreement. This software and
 * information or any other copies thereof may not be made available to any
 * other person.
 *
 ******************************************************************************/

const LAYERS = {
  /* base maps as image */
  images: [
    // {
    //   name: "Tranchot - v. Müffling 1803-1820",
    //   url: "data/maps/tranchot.png",
    //   bounds: [
    //     [50.29068795494675, 7.6328987132876716],
    //     [50.321764254593674, 7.705471469491065],
    //   ],
    //   options: {
    //     age: 1820,
    //   },
    // },

    {
      name: "Kartenaufnahme der Rheinlande 1803-1820",
      url: "data/maps/1803-1820_0.jpg",
      world: {
        file: "data/maps/1803-1820_0.jgw",
        proj: "UTM",
        zone: 32,
        band: "N",
      },
      options: {
        age: 1803,
      },
    },

    // {
    //   name: "Preuß. Uraufnahme 1843-1879",
    //   url: "data/maps/Friedrichssegen_Uraufnahme.jpg",
    //   world: {
    //     file: "data/maps/Friedrichssegen_Uraufnahme.jgw",
    //     proj: "UTM",
    //     zone: 32,
    //     band: "N",
    //   },
    //   options: {
    //     age: 1879,
    //   },
    // },


    // {
    //   name: "Preuß. Neuaufnahme 1902",
    //   url: "data/maps/preuss1902.png",
    //   bounds: [
    //     [50.294518434946525, 7.642596372689379],
    //     [50.31635902439836, 7.693803309016072],
    //   ],
    //   options: {
    //     age: 1902,
    //   },
    // },

    // {
    //   // ETRS89 / UTM 32N
    //   name: "TK25 2023",
    //   url: "data/maps/Friedrichssegen_TK25_Uebersicht.jpg",
    //   world: {
    //     file: "data/maps/Friedrichssegen_TK25_Uebersicht.jgw",
    //     proj: "UTM",
    //     zone: 32,
    //     band: "N",
    //   },
    //   options: {
    //     age: 2023,
    //   },
    // },
    {
      name: "Weiler TK25 2024",
      url: "data/maps/Weiler_UTM32.jpg",
      world: {
        file: "data/maps/Weiler_UTM32.jgw",
        proj: "UTM",
        zone: 32,
        band: "N",
      },
      options: {
        age: 2024,
      },
    },
  ],
  // /* OSM Rasterkarten */
  pmtiles: [
    {
      name: "OpenStreetMap 04/2024",
      url: "data/maps/test.pmtiles",
      options: {
        age: 2024,
      },
    },

  ],
  /* GeoJSON overlays */
  geojson: [
    {
      name: "Touristenroute",
      url: "data/overlays/WeilerTour.geojson",
      options: {
        age: 1,
      },
    },

    // {
    //   name: "Touristenroute",
    //   url: "data/overlays/Touristenroute.geojson",
    //   options: {
    //     age: 1,
    //   },
    // },

    {
      name: "Weiler Punkte Test",
      url: "data/overlays/WeilerPunkte.geojson",
      options: {
        age: 2,
      },
    },
    // {
    //   name: "Infopunkte",
    //   url: "data/overlays/Infopunkte.geojson",
    //   options: {
    //     age: 2,
    //   },  
    // },
    {
      name: "PDF Test",
      url: "data/overlays/PDFs.geojson",
      options: {
        age: 3,
      },
    },
    {
      name: "Video Test",
      url: "data/overlays/Videos.geojson",
      options: {
        age: 4,
      },
    },
    // {
    //   name: "Weiler POIs",
    //   url: "data/overlays/Weiler.geojson",
    //   options: {
    //     age: 5,
    //   },
    // },
  ],
};
