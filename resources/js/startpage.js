/*! BlindJoker's start page. */


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
    "letter": "YT",
    "label": "youtube",
    "href": "https://youtube.com/"
  },
  {
    "letter": "R",
    "label": "reddit",
    "href": "https://reddit.com/"
  },
    {
    "letter": "GDR",
    "label": "drive",
    "href": "https://drive.google.com/drive/my-drive"
  },
    {
    "letter": "GML",
    "label": "gmail",
    "href": "https://gmail.com/"
  },
    {
    "letter": "FB",
    "label": "facebook",
    "href": "https://www.facebook.com/"
  },
    {
    "letter": "FBM",
    "label": "messenger",
    "href": "https://www.messenger.com/"
  },
  {
    "letter": "GH",
    "label": "github",
    "href": "https://github.com/"
  },
  {
    "letter": "GPH",
    "label": "photos",
    "href": "https://photos.google.com/"
  },
  {
    "letter": "GCL",
    "label": "calendar",
    "href": "https://calendar.google.com/calendar/r"
  },
  {
    "letter": "AZ",
    "label": "amazon",
    "href": "http://amazon.com/"
  },
  {
    "letter": "AE",
    "label": "aliexpress",
    "href": "https://www.aliexpress.com/"
  },
  {
    "letter": "SL",
    "label": "slate",
    "href": "http://slate.nu.edu.pk/portal"
  },
  {
    "letter": "FL",
    "label": "flex",
    "href": "http://flexstudent.nu.edu.pk/Login"
  },
  {
    "letter": "WF",
    "label": "wells fargo",
    "href": "https://www.wellsfargo.com/"
  },
  {
    "letter": "TP",
    "label": "trans-plex",
    "href": "http://192.168.1.10:9091/transmission/web/"
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


