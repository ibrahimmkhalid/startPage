/*Grid and links */


const onReady = fn => {
  if (document.readyState !== 'loading') fn()
  else document.addEventListener('DOMContentLoaded', fn)
}

const downloadFile = ({ url, filename = '' }) => {
  if (!url) return

  const a = hyperHTML.wire()`<a download="${filename}" type="application/json" href="${url}" />`
  a.dispatchEvent(new MouseEvent('click'))
}

const promptUpload = () => {
  return new Promise((resolve, reject) => {
    const input = hyperHTML.wire()`<input type="file" accept="application/json" />`

    input.addEventListener('change', e => {
      const [file] = e.target.files
      if (!file) reject()
      else resolve(file)
    })

    input.dispatchEvent(new MouseEvent('click'))
  })
}

const toDataJSON = data => {
  return `data:application/json;charset=utf-8,${encodeURIComponent(data)}`
}

const defaultLinks = [
  {
    "letter": "SM1",
    "label": "sample1",
    "href": "https://youtube.com/"
  },
  {
    "letter": "SM2",
    "label": "sample2",
    "href": "https://reddit.com/"
  }
]

const startpage = {
  updateChannel: new EventTarget(),
  state: {
    command: false
  }
}

const getLinks = async () => {
  let data

  if (typeof browser !== 'undefined' && browser.storage) {
    data = await browser.storage.local.get()
  } else {
    const stor = localStorage.getItem('links')
    data = stor ? JSON.parse(stor) : {}
  }

  return data.links || defaultLinks
}

const setLinks = async links => {
  if (typeof browser !== 'undefined' && browser.storage) {
    await browser.storage.local.set({ links })
  } else {
    localStorage.setItem('links', JSON.stringify({ links }))
  }

  startpage.updateChannel.dispatchEvent(new Event('change'))
}

onReady(async () => {
  const { bind, wire } = hyperHTML

  const tile = props => wire(props)`
    <div class="tile z-depth-1 hoverable">
      <a href="${props.href}" class="letter">${props.letter}</a>
      <a href="${props.href}" class="label">${props.label}</a>
    </div>`

  const grid = document.querySelector('#grid')
  const update = () => bind(grid)`${getLinks().then(e => e.map(tile))}`

  update()
  startpage.updateChannel.addEventListener('change', update)

  document.addEventListener('keydown', async e => {
    if (startpage.state.command) {
      if (e.key == 'j') {
        const data = JSON.stringify(await getLinks(), null, 2)
        downloadFile({ url: toDataJSON(data), filename: `links-${+new Date()}.json` })
      } else if (e.key == 'l') {
        const reader = new FileReader()
        reader.addEventListener('load', f => setLinks(JSON.parse(f.target.result)))
        reader.readAsText(await promptUpload())
      }
    }

    startpage.state.command = e.ctrlKey && e.key == ';'
  })
})


/*Time stuff*/
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var ampm = "AM";
    m = checkTime(m);
    s = checkTime(s);
    if(h>12){
      ampm = "PM";
      h = h -12;
    } else {
      if(h == 12){
        ampm = "PM";
      } else {
      ampm = "AM";
      }
  }
    document.getElementById('timeData').innerHTML =
    [[h , m , s].join(":"), ampm].join(" ");
    var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

/*Weather stuff*/

var getLocation = function() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(createAPI);
      } else {
          getElementById('weatherData').innerHTML = "Geolocation is not supported by this browser.";
      }
};

var ur = "";

var createAPI = function(position) {
    ur = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
      ur = ur + "&APPID=d6c57b984aadbe13da26411370bd23c5";
      var json = undefined;

    $.ajax({
      dataType: "json",
      url: ur,
      data: function(data) {
      },
      success: function(success) {
          json = success;
          var temp = (json.main.temp - 273.15).toFixed(0);
          document.getElementById('weatherData').innerHTML =
          json.weather[0].main + "."+ "<br />"
           + temp + "°C";
      }
  });
};

getLocation();