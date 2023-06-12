$(document).ready(function () {
  const currentTime = moment().format("YYYY年MM月");
  document.getElementById("currentTime").innerHTML = currentTime;

  leftUpRankHeight();
  leftUp();
  leftDown();
  leftPieChart();
  // taiwanMap();
  rightPieChart();
  rightBarChart();
  rightColumnLineChart();
});

//暢銷書排行
const leftUp = async () => {
  const hCarouselWarpEle = $(".left .leftUp .hCarousel .hCarouselWarp");
  const rankUl = $(".left .leftUp ul");

  while (true) {
    //ul輪播層
    for (let i = 0; i < rankUl.length; i++) {
      // console.log("ul輪播層");
      rankUl.eq(i).children().removeClass("active");
      rankUl.eq(i).children().eq(0).addClass("active");

      const liActive = (i, j) =>
        new Promise((resolve) =>
          // clearTimeout(timer);
          setTimeout(() => {
            // console.log("li輪播層增減class");
            // console.log("i =", i);
            // console.log("j =", j);
            rankUl.eq(i).children().removeClass("active");
            rankUl.eq(i).children().eq(j).addClass("active");
            return resolve();
          }, 3000)
        );

      const liCarousel = async () => {
        //li輪播層
        for (let j = 1; j < 5; j++) {
          // console.log("li輪播層");
          await liActive(i, j);
        }
        return true;
      };
      const liFinished = await liCarousel();
      // console.log("liFinished-out =", liFinished);

      // transition过渡动画
      if (liFinished == true) {
        // console.log("liFinished =", liFinished);
        hCarouselWarpEle.addClass("go");
        if (i > rankUl.length) {
          i = 1;
          hCarouselWarpEle.css("top", 0);
          hCarouselWarpEle.removeClass("go");
        }
        if (i == 0) {
          // console.log("i == 0 if");
          // console.log("rankUl.length =", rankUl.length);
          hCarouselWarpEle.removeClass("top" + rankUl.length);
        } else {
          // console.log("i == 0 else");
          hCarouselWarpEle.removeClass("top" + i);
        }
        hCarouselWarpEle.addClass("top" + (i + 1));
      } else {
        break;
      }
    }
  }
};

const leftUpRankHeight = () => {
  const conH = $(".left .leftUp .hCarousel").height();
  $(".left .leftUp .ulCarousel").css("height", conH + "px");

  const rankH = $(".ulCarousel li:nth-child(2) .contentRecord").height();
  const rankShowH = 3.5 * rankH;

  $(".book-show").css("height", rankShowH + "px");

  let curBookRank = $(".left li.active .contentRecord");
  curBookRank.css("height", rankH + "px");

  const rankUl = $(".left .leftUp ul");
  let rank = "";
  let name = "";
  let company = "";
  let author = "";
  let isbn = "";
  let date = "";
  let pay = "";
  let img = "";
  let alt = "";

  rankUl.each((index, item) => {
    const len = item.children.length;
    // console.log("len =", len);
    for (let i = 0; i < len; i++) {
      // console.log("index =", index);
      // console.log("item =", item);
      rank = fakedata[index * 5 + i].rank;
      name = fakedata[index * 5 + i].name;
      company = fakedata[index * 5 + i].company;
      author = fakedata[index * 5 + i].author;
      isbn = fakedata[index * 5 + i].isbn;
      date = fakedata[index * 5 + i].date;
      pay = fakedata[index * 5 + i].pay;
      img = fakedata[index * 5 + i].img;
      alt = fakedata[index * 5 + i].alt;

      $(item.children[i]).find(".name").text(rank);
      $(item.children[i]).find(".name").text(name);
      $(item.children[i]).find(".company").text(company);
      $(item.children[i]).find(".author").text(author);
      $(item.children[i]).find(".isbn").text(isbn);
      $(item.children[i]).find(".date").text(date);
      $(item.children[i]).find(".pay").text(pay);
      $(item.children[i]).find("img").attr("src", img);
      $(item.children[i]).find("img").attr("alt", alt);
    }
  });
  // 複製第一個ul
  const parentWrap = $(".left .leftUp .hCarouselWarp");
  const ulClone = $(".left .leftUp ul").eq(0).clone(true);
  parentWrap.append(ulClone);

  // //獲取行高
  // const topSpan = $(".left .leftUp .contentRecord span");
  // const topSpanH = topSpan.height();
  // topSpan.css("line-height", topSpanH + "px");

  // const bottomSpan = $(".left .leftDown .contentRecord span");
  // const bottomSpanH = bottomSpan.height();
  // bottomSpan.css("line-height", bottomSpanH + "px");
};

//出版社排行
let pressNum = 0;
let timerNum = null;

const leftDown = () => {
  clearTimeout(timerNum);

  const rankUl = $(".left .leftDown ul");
  const rankUlLen = rankUl.children().length;
  // console.log("before setinterval")
  timerNum = setInterval(() => {
    // console.log("in setinterval")
    const currentLi = rankUl.children().eq(pressNum);
    // console.log('currentLi =', currentLi)
    currentLi.children(".contentRecord").addClass("pressRotate");
    // console.log('currentLi.children(".contentRecord") =', currentLi.children(".contentRecord"))
    currentLi.siblings().children(".contentRecord").removeClass("pressRotate");
    pressNum++;

    if (pressNum > rankUlLen) {
      pressNum = 0;
      clearTimeout(timerNum);
    }
  }, 1000);
};

//台灣地圖
// const taiwanMap = async () => {
//   console.log("taiwanMap");
//   const topology = await fetch(
//     "https://code.highcharts.com/mapdata/countries/tw/tw-all.topo.json"
//   ).then((response) => response.json());
//   console.log("topology =", topology);
//   Highcharts.mapChart("twMap", {
//     chart: {
//       // borderWidth: 1,
//       map: topology,
//       backgroundColor: "rgba(0, 0, 0, 0.1)",
//     },

//     title: {
//       text: "",
//       // text: "交換書目數據地圖",
//       // style:{
//       //   color: '#ffffff'
//       // }
//     },
//     credits: {
//       enabled: false,
//     },

//     legend: {
//       enabled: false,
//     },

//     mapNavigation: {
//       enabled: true,
//       buttonOptions: {
//         verticalAlign: "bottom",
//       },
//     },

//     mapView: {
//       projection: {
//         name: "WebMercator",
//       },
//       center: [121, 23.6],
//       zoom: 7.5,
//     },

//     tooltip: {
//       positioner: function () {
//           return { x: 458, y: 285 };
//       },
//       borderWidth: 0,
//       shadow: false,
//       backgroundColor: "rgba(0, 0, 0, 0)",
//       style:{
//         color:'#ffffff'
//       },
//       useHTML: true,
//       pointFormat:'<div class="d-flex w-100"><div class="mapTooltipTitle">{point.id}</div><div class="mapTooltipText">{point.z} 千</div></div>',
//   },

//     series: [
//       {
//         keys: ["hc-key", "z", "id"],
//         joinBy: "hc-key",
//         data: mapData,
//         tooltip: {
//           headerFormat: "",
//           // pointFormat: "{point.id}: {point.z} 千",
//         },
//       },
//       {
//         type: "mapbubble",
//         keys: ["hc-key", "z", "id"],
//         joinBy: "hc-key",
//         data: bubbleData,
//         color: "#fbfb00",
//         marker: {
//           fillOpacity: 0.8,
//           lineWidth: 0,
//           states: {
//             hover: {
//               lineWidthPlus: 15,
//             },
//           },
//         },
//         minSize: 4,
//         maxSize: "8%",
//         tooltip: {
//           headerFormat: "",
//           pointFormat: "{point.id}",
//         },
//       },
//     ],
//   });
// };

//分類銷售佔比
const leftPieChart = () => {
  Highcharts.chart("leftPie", {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    title: {
      text: "11%<br>其他",
      align: "center",
      verticalAlign: "middle",
      y: 20,
      style: {
        color: "#ffffff",
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    colors: ["#0239a7", "#ffffff", "#00bbec", "#23539b", "#24feb4", "#1397ff"],
    legend: {
      itemStyle: {
        color: "#ffffff",
        fontWeight: "bold",
      },
      alignColumns: false,
      floating: true,
      y: 20,
    },
    credits: {
      enabled: false,
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
        size: "70%",
      },
    },
    series: [
      {
        name: "Brands",
        colorByPoint: true,
        innerSize: "80%",
        data: leftPieChartFakeData,
      },
    ],
  });
};

//分類庫存占比
const rightPieChart = () => {
  Highcharts.chart("rightPie", {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    title: {
      text: "11%<br>其他",
      align: "center",
      verticalAlign: "middle",
      y: 20,
      style: {
        color: "#ffffff",
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    colors: ["#0239a7", "#ffffff", "#00bbec", "#23539b", "#24feb4", "#1397ff"],
    legend: {
      itemStyle: {
        color: "#ffffff",
        fontWeight: "bold",
      },
      alignColumns: false,
      floating: true,
      y: 20,
    },
    credits: {
      enabled: false,
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
        size: "70%",
      },
    },
    series: [
      {
        name: "Brands",
        colorByPoint: true,
        innerSize: "80%",
        data: leftPieChartFakeData,
      },
    ],
  });
};

//各地區銷售碼洋排行
const rightBarChart = () => {
  Highcharts.chart("rightBar", {
    chart: {
      type: "bar",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    xAxis: {
      title: {
        text: null,
      },
      type: "category",
      labels: {
        style: {
          color: "#2edbff",
        },
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        enabled: false,
      },
      gridLineColor: "rgba(0, 0, 0, 0)",
    },
    title: {
      text: "",
    },
    tooltip: {
      valueSuffix: " millions",
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: "{y}萬",
          color: "#2edbff",
        },
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        data: rightBarChartFakeData,
        color: {
          linearGradient: {
            x1: 1,
            x2: 1,
            y1: 0,
            y2: 1,
          },
          stops: [
            [0, "#00fecc"],
            [1, "#2690cf"],
          ],
        },
        borderColor: "none",
      },
    ],
  });
};

//全台市場圖書走勢圖
const rightColumnLineChart = () => {
  Highcharts.chart("rightColumnLine", {
    chart: {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    title: {
      text: "全台市場圖書走勢圖",
      align: "left",
      style: { color: "#ffffff", fontSize: "1.25rem" },
    },
    credits: {
      enabled: false,
    },
    xAxis: [
      {
        type: "category",
        crosshair: true,
        labels: {
          style: {
            color: "#2edbff",
          },
        },
      },
    ],
    yAxis: [
      {
        // Primary yAxis
        labels: {
          // format: "{value} 千萬",
          style: {
            color: "#2edbff",
          },
        },
        title: {
          text: "銷售碼洋(千萬)",
          style: {
            color: "#2edbff",
          },
        },
      },
      {
        // Secondary yAxis
        title: {
          text: "同比增長(%)",
          style: {
            color: "#2edbff",
          },
        },
        labels: {
          // format: "{value} %",
          style: {
            color: "#2edbff",
          },
        },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
    },
    legend: {
      align: "right",
      x: 0,
      verticalAlign: "top",
      y: -5,
      floating: true,
      backgroundColor: "rgba(255,255,255,0)",
      itemStyle: {
        color: "#ffffff",
      },
    },
    series: [
      {
        name: "銷售碼洋",
        type: "column",
        yAxis: 1,
        data: rightColumnFakeData,
        tooltip: {
          valueSuffix: " 千萬",
        },
        color: {
          linearGradient: {
            x1: 1,
            x2: 1,
            y1: 0,
            y2: 1,
          },
          stops: [
            [0, "#00fecc"],
            [1, "#2690cf"],
          ],
        },
        borderColor: "none",
      },
      {
        name: "同比增長",
        type: "spline",
        data: rightLineFakeData,
        tooltip: {
          valueSuffix: "%",
        },
        color: "#ffffff",
      },
    ],
  });
};
