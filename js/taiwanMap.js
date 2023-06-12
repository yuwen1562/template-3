//載入圖資
const features = new ol.format.GeoJSON().readFeatures(geojson);
console.log("features =", features);

features.forEach((feature) => {
  const obj = feature.getProperties();
  const chineseKey = obj["hc-key"];
  
  mapChinese.forEach((item) => {
    if (chineseKey == item[0]) {
      feature.setProperties({ chineseName: item[1] });
    }
  });

  //載入資料
  mapData.forEach((data) => {
    let color = "";
    if (chineseKey == data[0]) {
      if (data[1] <= 100) {
        color = "rgba(0, 66, 223, 0.2)";
      } else if (data[1] > 100 && data[1] <= 200) {
        color = "rgba(14, 125, 235, 0.2)";
      } else if (data[1] > 200 && data[1] <= 300) {
        color = "rgba(0, 182, 246, 0.2)";
      } else if (data[1] > 300) {
        color = "rgba(39, 233, 253, 0.2)";
      } else {
        color = "rgba(238, 238, 238, 0.2)";
      }
      feature.setProperties({ dataValue: data[1], color: color });
    }
  });
});
console.log("after-features =", features);

//初始樣式
const fill = new ol.style.Fill({
  color: "rgba(255,255,255,1)",
});
// const stroke = new ol.style.Stroke({
//   color: 'rgba(255, 255, 255, 0)',
//   width: 0,
// });
const style = new ol.style.Style({
  fill: fill,
  // stroke: stroke,
});

const pointStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "rgba(255,255,0,0.6)",
  }),
});

const pointFeatures = [];
const vectorSource = new ol.source.Vector();

// proj4.defs(
//   "EPSG:32651",
//   "+proj=utm +zone=51 +datum=WGS84 +units=m +no_defs +type=crs"
// );
// ol.proj.proj4.register(proj4);

bubbleData.forEach((bubble, index) => {
  // const lon = feature.get("longitude");
  // console.log("lon =", lon);
  // const lat = feature.get("latitude");
  // console.log("lat =", lat);
  // const fromLonLat = ol.proj.fromLonLat([lon, lat], "EPSG:3857");
  // console.log("fromLonLat =", fromLonLat);
  const xy = [bubble[2], bubble[3]];
  const size = bubble[1] + 70;
  pointFeatures.push(new ol.Feature(new ol.geom.Circle(xy, size)));

  mapChinese.forEach((item) => {
    if (bubble[0] == item[0]) {
      pointFeatures[index].setProperties({ chineseName: item[1] });
    }
  });
});
vectorSource.addFeatures(pointFeatures);

// const swissProjection = ol.proj.get('EPSG:32651');
// console.log("swissProjection =", swissProjection);

const view = new ol.View({
  // center: ol.proj.fromLonLat([121.82164, 23.59017]),
  // projection: swissProjection,
  center: [5200, 3100],
  zoom: 13.1,
  maxZoom: 15,
  extent: [-5000, -4000, 16000, 11600],
});
// console.log("view =", view);

const map = new ol.Map({
  layers: [
    // new ol.layer.Tile({
    //   source: new ol.source.OSM()
    // }),

    //GeoJson當底圖
    new ol.layer.Vector({
      source: new ol.source.Vector({
        features: features,
      }),
      // background: "white",
      style: (feature) => {
        const color = feature.get("color") || "#07577D";
        style.getFill().setColor(color);
        return style;
      },
    }),

    //data設圓點
    new ol.layer.Vector({
      source: vectorSource,
      style: pointStyle,
    }),
  ],
  // keyboardEventTarget: document,
  target: "twMap",
  view: view,
  // style: styles,
  controls: ol.control.defaults
    .defaults()
    .extend([new ol.control.ZoomSlider()]),
});

const hoverStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "#034DE4",
  }),
  stroke: new ol.style.Stroke({
    color: "rgba(255,255,255,0.7)",
    width: 2,
  }),
});

const pointHoverStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "rgba(255,255,0,1)",
  }),
  stroke: new ol.style.Stroke({
    color: "rgba(255,255,0,1)",
    width: 4,
  }),
});

const pointPopup = document.getElementById("pointPopup")

const container = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupContent = document.getElementById("popupContent");

const overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  positioning: "top-center",
});
map.addOverlay(overlay);

const pointOverlay = new ol.Overlay({
  element: pointPopup,
  autoPan: true,
  positioning: "top-center",
});
map.addOverlay(pointOverlay);

let hovered = null;
map.on("pointermove", (e) => {
  // console.log('e =', e)
  const coordinate = e.coordinate;
  // console.log("coordinate =", coordinate);

  if (hovered != null) {
    hovered.setStyle(undefined);
    hovered = null;
  }

  const feature = map.forEachFeatureAtPixel(e.pixel, (feature) => {
    hovered = feature;
    let color = "";
    const dataValue = feature.get("dataValue");
    if (dataValue != undefined) {
      if (dataValue <= 100) {
        color = "#0042df";
      } else if (dataValue > 100 && dataValue <= 200) {
        color = "#0E7DEB";
      } else if (dataValue > 200 && dataValue <= 300) {
        color = "#00b6f6";
      } else if (dataValue > 300) {
        color = "#27E9FD";
      } else {
        color = "#eeeeee";
      }
      hoverStyle.getFill().setColor(color);
      feature.setStyle(hoverStyle);
    } else {
      feature.setStyle(pointHoverStyle)
    }
    return feature;
  });
  // console.log("feature =", feature);

  const haveHcKey = feature?feature.get('hc-key'):undefined

  if (feature && haveHcKey != undefined) {
    popupTitle.innerHTML = "";
    popupContent.innerHTML = "";

    popupTitle.innerHTML = feature.getProperties().chineseName;
    popupContent.innerHTML = "我是 popupContent";

    //彈出視窗
    overlay.setPosition(coordinate);

    //關掉視窗
    pointOverlay.setPosition(undefined);
  } else if (feature && haveHcKey == undefined) {
    pointPopup.innerHTML =""

    pointPopup.innerHTML =feature.getProperties().chineseName

    //彈出視窗
    pointOverlay.setPosition(coordinate);

    //關掉視窗
    overlay.setPosition(undefined);
  }else {
    //關掉視窗
    overlay.setPosition(undefined);
    pointOverlay.setPosition(undefined);
  }
});

//區塊輪巡
const blockPatrol = async () => {
  let color = "";
  let patrolStyle = null;
  const focusTitle = document.getElementById("focusTitle");
  const focusContent = document.getElementById("focusContent");

  for (let i = 0; i < features.length; i++) {
    // console.log("區塊輪巡-feature =", features[i]);
    const feature = features[i];
    const dataValue = feature.get("dataValue");
    patrolStyle = new ol.style.Style({
      fill: new ol.style.Fill(),
      stroke: new ol.style.Stroke({
        color: "rgba(255,255,255,0.7)",
        width: 2,
      }),
    });

    const patrolDark = (feature, patrolStyle, color, dataValue) =>
      new Promise((resolve) =>
        setTimeout(() => {
          if (dataValue <= 100) {
            color = "rgba(0, 66, 223, 0.2)";
          } else if (dataValue > 100 && dataValue <= 200) {
            color = "rgba(14, 125, 235, 0.2)";
          } else if (dataValue > 200 && dataValue <= 300) {
            color = "rgba(0, 182, 246, 0.2)";
          } else if (dataValue > 300) {
            color = "rgba(39, 233, 253, 0.2)";
          } else {
            color = "rgba(238, 238, 238, 0.2)";
          }
          patrolStyle.getFill().setColor(color);
          patrolStyle.getStroke().setColor("rgba(255, 255, 255, 0)");
          patrolStyle.getStroke().setWidth(0);
          feature.setStyle(patrolStyle);

          return resolve(true);
        }, 3000)
      );

    const patrolLight = (feature, patrolStyle, color, dataValue) =>
      new Promise((resolve) =>
        setTimeout(() => {
          // console.log("區塊輪巡-patrolActive-setTimeout");
          if (dataValue <= 100) {
            color = "#0042df";
          } else if (dataValue > 100 && dataValue <= 200) {
            color = "#0E7DEB";
          } else if (dataValue > 200 && dataValue <= 300) {
            color = "#00b6f6";
          } else if (dataValue > 300) {
            color = "#27E9FD";
          } else {
            color = "#eeeeee";
          }
          patrolStyle.getFill().setColor(color);
          feature.setStyle(patrolStyle);

          if (feature) {
            focusTitle.innerHTML = "";
            focusContent.innerHTML = "";

            focusTitle.innerHTML = feature.getProperties().chineseName;
            focusContent.innerHTML = dataValue;
          }

          return resolve(true);
        }, 1000)
      );

    await patrolLight(feature, patrolStyle, color, dataValue);
    await patrolDark(feature, patrolStyle, color, dataValue);
  }
};
blockPatrol();
